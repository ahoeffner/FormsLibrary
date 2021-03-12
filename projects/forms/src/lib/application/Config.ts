import { KeyMap } from "../keymap/KeyMap";
import { Injectable } from "@angular/core";
import { MacKeyMap } from "../keymap/MacKeyMap";
import { HttpClient } from "@angular/common/http";
import { Preferences } from "./Preferences";


@Injectable({
    providedIn: 'root',
})


export class Config
{
    private config:any = null;
    private keymap$:KeyMap = null;
    private invoker:Promise<any> = null;
    private prefs$:Preferences = new Preferences();


    constructor(private client:HttpClient)
    {
        this.load();
        this.keymap$ = new MacKeyMap();
    }

    private async load()
    {
        this.invoker = this.client.get<any>("/assets/config.json").toPromise();
        this.invoker.then(data => {this.config = data;}, error => {this.config = {}; console.log("Loading config failed: "+error)});
    }

    private async ready()
    {
        if (this.invoker != null)
        {
            await this.invoker;
            this.invoker = null;
        }
    }

    public async getConfig() : Promise<any>
    {
        await this.ready();
        return(this.config);
    }

    public get preferences() : Preferences
    {
        return(this.prefs$);
    }

    public get keymap() : KeyMap
    {
        return(this.keymap$);
    }
}