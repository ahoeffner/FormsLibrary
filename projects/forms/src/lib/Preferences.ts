export class Preferences
{
    private static accent:string = "#ff4081";
    private static primary:string = "#303f9f";
    private static textcolor:string = "white";
    private static lang:string = Intl.DateTimeFormat().resolvedOptions().locale;


    public static set theme(theme:string)
    {
        if (theme.indexOf("indigo-pink") >= 0)
        {
            Preferences.accent = "#ff4081";
            Preferences.primary = "#303f9f";
        }

        if (theme.indexOf("pink-bluegrey") >= 0)
        {
            Preferences.accent = "#b0bec5";
            Preferences.primary = "#e91e63";
        }
    }


    public static get textColor() : string
    {
        return(Preferences.textcolor);
    }


    public static get accentColor() : string
    {
        return(Preferences.accent);
    }


    public static get primaryColor() : string
    {
        return(Preferences.primary);
    }


    public static set Lang(lang:string)
    {
        Preferences.lang = lang;
    }


    public static get Lang() : string
    {
        return(Preferences.lang);
    }
}