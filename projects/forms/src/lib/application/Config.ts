import { KeyMap } from "../keymap/KeyMap";
import { Injectable } from "@angular/core";
import { MacKeyMap } from "../keymap/MacKeyMap";
import { HttpClient } from "@angular/common/http";
import { Theme, Pink, Grey, Yellow, Indigo, defaultTheme } from "./Themes";


@Injectable({
    providedIn: 'root',
})


export class Config
{
    private colors$:Theme;
    private config:any = null;
    private keymap$:KeyMap = null;
    private notifications:any[] = [];
    private invoker:Promise<any> = null;
    private themes:Map<string,Theme> = new Map<string,Theme>();


    constructor(private client:HttpClient)
    {
        this.load();
        this.keymap$ = new MacKeyMap();
        this.themes.set("pink",new Pink());
        this.themes.set("grey",new Grey());
        this.themes.set("indigo",new Indigo());
        this.themes.set("yellow",new Yellow());
        this.themes.set("default",new defaultTheme());
        this.colors$ = this.themes.get("default");
    }

    private async load()
    {
        this.invoker = this.client.get<any>("/assets/config/config.json").toPromise();
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

    public get keymap() : KeyMap
    {
        return(this.keymap$);
    }

    public get colors() : Theme
    {
        return(this.colors$);
    }

    public async others() : Promise<any>
    {
        await this.ready();
        return(this.config);
    }

    public notify(instance:any, func:string) : void
    {
        this.notifications.push({instance: instance, func: func});
    }

    public setTheme(theme:string|Theme) : void
    {
        let ttheme:Theme = null;

        if (typeof theme == 'object') ttheme = theme as Theme;
        else                          ttheme = this.themes.get(theme);

        if (ttheme != null)
        {
            this.colors$ = ttheme;
            this.notifications.forEach((notify) => {notify.instance[notify.func]()});
        }
    }
}