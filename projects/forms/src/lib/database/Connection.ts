import { ApplicationImpl } from "../application/ApplicationImpl";

export class Connection
{
    public connected:boolean = false;
    public constructor(private app:ApplicationImpl) {}


    public async connect(usr:string, pwd:string) : Promise<void>
    {
        //let promise:Promise<any> = this.sleep(2000);
        //promise.then((arg) => {console.log("promise done "+arg)}, () => {console.log("error")});
        this.connected = true;
        this.app.appstate.onConnect();
    }


    public async disconnect() : Promise<void>
    {
        this.connected = false;
        this.app.appstate.onDisconnect();
    }
}