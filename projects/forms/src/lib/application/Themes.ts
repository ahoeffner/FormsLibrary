export interface Theme
{
    name:string;
    link:string;
    text:string;
    title:string;
    topbar:string;
    disabled:string;
    foldertree:string;
    buttontext:string;
}


export class Themes
{
    private static themes:Map<string,Theme> = new Map<string,Theme>();


    public static add(theme:Theme)
    {
        Themes.themes.set(theme.name.toLowerCase(),theme);
    }


    public static get(name:string) : Theme
    {
        return(Themes.themes.get(name.toLowerCase()));
    }
}


export class defaultTheme implements Theme
{
    public name:string = "default";

    public link:string = "blue";
    public text:string = "white";
    public title:string = "white";
    public topbar:string = "#303f9f";
    public foldertree:string = "#303f9f";
    public disabled:string = "silver";
    public buttontext:string = "white";
}


export class Indigo extends defaultTheme
{
    public name:string = "indigo";
}


export class Grey extends defaultTheme
{
    public name:string = "grey";
    public topbar:string = "grey";
    public foldertree:string = "grey";
}


export class Pink extends defaultTheme
{
    public name:string = "pink";
    public link:string = "#464646";
    public topbar:string = "#ff4081";
    public foldertree:string = "#ff4081";
    public disabled:string = "#464646";
}


export class Yellow implements Theme
{
    public name:string = "yellow";

    public link:string = "grey";
    public text:string = "white";
    public title:string = "black";
    public topbar:string = "yellow";
    public foldertree:string = "grey";
    public disabled:string = "grey";
    public buttontext:string = "black";
}
