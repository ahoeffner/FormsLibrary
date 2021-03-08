import { HttpClient } from "@angular/common/http";
import { Preferences } from "./Preferences";

export class Config
{
    private config:any = {};
    constructor(private client:HttpClient) {}

    public async getConfig() : Promise<any>
    {
        let inv:Promise<any> = this.client.get<any>("/assets/config.json").toPromise();
        await inv.then(data => {this.config = data;}, error => {console.log("Loading config failed: "+error)});
        let prefs:Preferences = new Preferences();
        prefs.setTheme("pink");
        return(this.config);
    }
}