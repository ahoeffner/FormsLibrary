import { MessageBox } from "../popup/MessageBox";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";


export class Connection
{
    private url:string = null;
    private conn:string = null;
    private keepalive:number = 0;
    private client:HttpClient = null;


    public constructor(private app:ApplicationImpl)
    {
        this.client = app.client;
    }


    public async connect(usr:string, pwd:string) : Promise<void>
    {
        if (this.url == null)
        {
            await this.app.conf.ready();
            let conf:any = await this.app.conf.others;

            this.url = conf["backend"];
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
            this.alert("username and password must be specified to logon");
            return;
        }

        let credentials = {usr: usr, pwd: pwd};
        let response:any = await this.invoke("connect",credentials);

        if (response["status"] != "ok")
        {
            this.alert(JSON.stringify(response));
            return;
        }

        this.conn = response["id"];;
        this.keepalive = response["keep-alive"];

        this.app.appstate.onConnect();
        this.keepAlive();
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
        {
            this.alert(JSON.stringify(response));
            return;
        }

        this.conn = null;
        this.keepalive = 0;
        this.app.appstate.onDisconnect();
    }


    private async keepAlive()
    {
        if (this.conn != null && +this.keepalive > 0)
        {
            let body:any = {"keep-alive": true};
            let response:any = await this.invoke("ping",body);

            if (response["status"] != "ok")
            {
                this.alert(JSON.stringify(response),"KeepAlive stopped");
                this.keepalive = 0;
            }

            setTimeout(() => {this.keepAlive()},this.keepalive*1000);
        }
    }


    public async invoke(cmd:string, body:any) : Promise<any>
    {
        let url:string = this.url + "/";
        if (this.conn != null) url = url + this.conn + "/";

        return(
            this.client.post<any>(url+cmd,body).toPromise().then
            (
                data => {return(this.onReply(data));},
                error => {return(this.onReply(error));}
            )
        );
    }


    private onReply(data:any) : any
    {
        let response:any = null;
        if (!(data instanceof HttpErrorResponse)) response = data;
        else response = {status: "failed", error: "500", message: JSON.stringify(data.message)};
        return(response);
    }


    private alert(msg:string, title?:string) : void
    {
        if (title == null) title = "Failed to logon to database";
        MessageBox.show(this.app,msg,title);
    }
}