export class Preferences
{
    private accent:string = "#ff4081";
    private primary:string = "#303f9f";
    private textcolor:string = "white";
    private static prefs:Preferences = new Preferences();
    private lang:string = Intl.DateTimeFormat().resolvedOptions().locale;

    public static get() : Preferences
    {
        return(Preferences.prefs);
    }

    public set theme(theme:string)
    {
        if (theme.indexOf("indigo-pink") >= 0)
        {
            this.accent = "#ff4081";
            this.primary = "#303f9f";
        }

        if (theme.indexOf("pink-bluegrey") >= 0)
        {
            this.accent = "#b0bec5";
            this.primary = "#e91e63";
        }
    }


    public set textColor(textcolor:string)
    {
        this.textcolor = textcolor;
    }


    public get textColor() : string
    {
        return(this.textcolor);
    }


    public set accentColor(accent:string)
    {
        this.accent = accent;
    }


    public get accentColor() : string
    {
        return(this.accent);
    }


    public set primaryColor(primary:string)
    {
        this.primary = primary;
    }


    public get primaryColor() : string
    {
        return(this.primary);
    }


    public set Lang(lang:string)
    {
        this.lang = lang;
    }


    public get Lang() : string
    {
        return(this.lang);
    }
}