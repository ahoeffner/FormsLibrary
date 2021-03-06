import { Wait } from "../utils/Wait";
import { MessageBox } from "../popup/MessageBox";
import { SQLType, Statement } from "./Statement";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";


export class Connection
{
    private url:string = null;
    private conn:string = null;
    private keepalive:number = 0;
    private client:HttpClient = null;

    private stmtid:number = 0;
    private waitlim:number = 250;
    private running:Map<number,number> = new Map<number,number>();


    public constructor(private app:ApplicationImpl)
    {
        this.client = app.client;
    }


    public async connect(usr:string, pwd:string) : Promise<void>
    {
        if (this.url == null)
        {
            await this.app.config.ready();
            let conf:any = await this.app.config.others;

            this.url = conf["database.js"];
            if (this.url == null || this.url.length == 0)
                this.url = window.location.origin;
        }

        if (this.conn != null)
        {
            this.alert("Already logged on");
            return;
        }

        if (usr == null || pwd == null)
        {
            this.alert("Username and password must be specified to logon");
            return;
        }

        let credentials = {usr: usr, pwd: pwd};
        let response:any = await this.invoke("connect",credentials);

        if (response["status"] == "failed")
        {
            this.alert(response["message"]);
            return;
        }

        this.conn = response["id"];;
        this.keepalive = response["keep-alive"];

        this.app.appstate.onConnect();
        this.keepAlive();

        return(response);
    }


    public async commit() : Promise<boolean>
    {
        if (this.conn != null)
        {
            let response:any = await this.invoke("commit",{});

            if (response["status"] != "ok")
                this.alert(JSON.stringify(response));

            this.app.appstate.transactionChange(false);
            return(false);
        }

        return(true);
    }


    public async rollback() : Promise<boolean>
    {
        if (this.conn != null)
        {
            let response:any = await this.invoke("rollback",{});

            if (response["status"] != "ok")
            {
                this.alert(JSON.stringify(response));
                return(false);
            }

            this.app.appstate.transactionChange(false);
            return(false);
        }

        return(true);
    }


    public get connected() : boolean
    {
        return(this.conn != null);
    }


    public async disconnect() : Promise<void>
    {
        if (this.conn == null)
        {
            this.alert("not logged on");
            return;
        }

        let response:any = await this.invoke("disconnect",{});

        if (response["status"] != "ok")
            this.alert(JSON.stringify(response));

        this.conn = null;
        this.keepalive = 0;

        this.app.appstate.transactionChange(false);
        this.app.appstate.onDisconnect();
    }


    private async keepAlive()
    {
        if (this.conn != null && +this.keepalive > 0)
        {
            let response:any = null;
            let body:any = {"keep-alive": true};

            await this.client.post<any>(this.url+"/"+this.conn+"/ping",body).toPromise().then
            (
                data => {response = data},
                error => {response = error}
            )

            if (response["status"] != "ok")
            {
                this.keepalive = 0;
                this.alert(JSON.stringify(response),"KeepAlive stopped");
            }

            setTimeout(() => {this.keepAlive()},this.keepalive*1000);
        }
    }


    public async invokestmt(stmt:Statement) : Promise<any>
    {
        return(this.invoke(SQLType[stmt.type],stmt.build()));
    }


    public async invoke(cmd:string, body:any, nowait?:boolean) : Promise<any>
    {
        let url:string = this.url + "/";

        if (nowait == null) nowait = false;
        if (this.conn != null) url = url + this.conn + "/";

        if (this.conn == null && cmd != "connect")
            return({status: "failed", message: "Not logged on"});

        if (cmd == "lock" || cmd == "insert" || cmd == "update" || cmd == "delete")
            this.app.appstate.transactionChange(true);

        let stid:number = this.stmtid++;
        let start:number = new Date().getTime();

        if (!nowait)
        {
            this.running.set(stid,start);
            setTimeout(() => {this.showwait()},+this.waitlim + +10);    
        }

        return(
            this.client.post<any>(url+cmd,body).toPromise().then
            (
                data => {return(this.onReply(stid,data));},
                error => {return(this.onReply(stid,error));}
            )
        );
    }


    private onReply(stid:number, data:any) : any
    {
        let response:any = null;

        this.running.delete(stid);
        this.showwait();

        if (!(data instanceof HttpErrorResponse)) response = data;
        else response = {status: "failed", error: "500", message: JSON.stringify(data.message)};
        return(response);
    }


    private alert(msg:string, title?:string) : void
    {
        if (title == null) title = "Database Call Failed";
        MessageBox.show(this.app,msg,title);
    }


    private showwait() : void
    {
        let now:number = new Date().getTime();
        let min:number = now;

        this.running.forEach((start) =>
        {
            if (+start < +min) min = start;
        });

        let show:boolean = false;
        if (now - min > +this.waitlim) show = true;

        if (show) Wait.show(this.app);
        else      Wait.close(this.app);
    }
}