import { Theme, defaultTheme, Themes } from "./Themes";

export class Preferences
{
    public colors:Theme;
    public environment:Environment;

    private static scol:Colors = null;
    private static senv:Environment = null;

    public constructor()
    {
        let theme:Theme = new defaultTheme();

        if (Preferences.senv == null) Preferences.senv = new Environment();
        if (Preferences.scol == null) Preferences.scol = new Colors(theme);

        this.colors = Preferences.scol;
        this.environment = Preferences.senv;
    }


    public setTheme(theme:string|Theme) : void
    {
        Preferences.scol = new Colors(theme);
        this.colors = Preferences.scol;
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
        this.disabled = ttheme.disabled;
        this.buttontext = ttheme.buttontext;
    }
}

class Environment
{
    public lang:string = Intl.DateTimeFormat().resolvedOptions().locale;
}