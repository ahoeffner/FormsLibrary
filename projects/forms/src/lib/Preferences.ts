export class Preferences
{
    private props:Properties = Properties.props;

    public set theme(theme:string)
    {
        if (theme.indexOf("indigo-pink") >= 0)
        {
            this.props.accent = "#ff4081";
            this.props.primary = "#303f9f";
        }

        if (theme.indexOf("pink-bluegrey") >= 0)
        {
            this.props.accent = "#b0bec5";
            this.props.primary = "#e91e63";
        }
    }

    public set titleColor(titlecolor:string)
    {
        this.props.titlecolor = titlecolor;
    }

    public get titleColor() : string
    {
        return(this.props.titlecolor);
    }

    public set textColor(textcolor:string)
    {
        this.props.textcolor = textcolor;
    }

    public get textColor() : string
    {
        return(this.props.textcolor);
    }

    public set linkColor(linkcolor:string)
    {
        this.props.linkcolor = linkcolor;
    }

    public get linkColor() : string
    {
        return(this.props.linkcolor);
    }

    public set accentColor(accent:string)
    {
        this.props.accent = accent;
    }


    public get accentColor() : string
    {
        return(this.props.accent);
    }


    public set primaryColor(primary:string)
    {
        this.props.primary = primary;
    }


    public get primaryColor() : string
    {
        return(this.props.primary);
    }


    public set Lang(lang:string)
    {
        this.props.lang = lang;
    }


    public get Lang() : string
    {
        return(this.props.lang);
    }
}


class Properties
{
    public static props:Properties = new Properties();

    public linkcolor:string = "blue";
    public accent:string = "#ff4081";
    public primary:string = "#303f9f";
    public textcolor:string = "white";
    public titlecolor:string = "black";
    public lang:string = Intl.DateTimeFormat().resolvedOptions().locale;
}