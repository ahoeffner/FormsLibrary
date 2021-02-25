export class Connection
{
    public async connect(usr:string, pwd:string) : Promise<boolean>
    {
        //let promise:Promise<any> = this.sleep(2000);
        //promise.then((arg) => {console.log("promise done "+arg)}, () => {console.log("error")});
        return(true);
    }


    public async disconnect() : Promise<boolean>
    {
        return(true);
    }
}