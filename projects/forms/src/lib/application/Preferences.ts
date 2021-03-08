import { Themes, Theme, defaultTheme, Yellow, Pink, Grey, Indigo } from "./Themes";

export class Preferences
{
    private colors$:Theme;
    private environment$:Environment;

    private static scol:Theme = null;
    private static senv:Environment = null;
    private static notifications:any[] = [];

    public static notify(instance:any, func:string) : void
    {
        Preferences.notifications.push({instance: instance, func: func});
    }


    public constructor()
    {
        if (Preferences.scol == null)
        {
            Themes.add(new Yellow());
            Themes.add(new Pink());
            Themes.add(new Grey());
            Themes.add(new Indigo());
            Themes.add(new defaultTheme());
            Preferences.scol = new Colors(Themes.get("default"));
        }

        if (Preferences.senv == null) Preferences.senv = new Environment();

        this.colors$ = Preferences.scol;
        this.environment$ = Preferences.senv;
    }


    public get colors() : Theme
    {
        return(this.colors$);
    }


    public get environment() : Environment
    {
        return(this.environment$);
    }


    public setTheme(theme:string|Theme) : void
    {
        let ttheme:Theme = null;

        if (typeof theme == 'object') ttheme = theme as Theme;
        else                          ttheme = Themes.get(theme);

        if (ttheme != null)
        {
            Preferences.scol = ttheme;
            this.colors$ = Preferences.scol;
            Preferences.notifications.forEach((notify) => {notify.instance[notify.func]()});
        }
    }


    public addTheme(theme:Theme) : void
    {
        Themes.add(theme);
    }
}


class Colors implements Theme
{
    public name:string;
    public link:string;
    public text:string;
    public title:string;
    public topbar:string;
    public foldertree:string;
    public disabled:string;
    public buttontext:string;

    constructor(theme:string|Theme)
    {
        this.setTheme(theme);
    }

    private setTheme(theme:string|Theme)
    {
        let ttheme:Theme = null;

        if (typeof theme == 'object') ttheme = theme as Theme;
        else                          ttheme = Themes.get(theme);

        this.name = ttheme.name;
        this.link = ttheme.link;
        this.text = ttheme.text;
        this.title = ttheme.title;
        this.topbar = ttheme.topbar;
        this.foldertree = ttheme.foldertree;
        this.disabled = ttheme.disabled;
        this.buttontext = ttheme.buttontext;
    }
}

class Environment
{
    public lang:string = Intl.DateTimeFormat().resolvedOptions().locale;
}