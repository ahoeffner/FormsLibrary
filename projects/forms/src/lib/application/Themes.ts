export interface Theme
{
    name:string;
    link:string;
    text:string;
    title:string;
    topbar:string;
    disabled:string;
    buttontext:string;
}


export class Themes
{
    private static themes:Map<string,Theme> = new Map<string,Theme>();


    public static add(theme:Theme)
    {
        Themes.themes.set(theme.name,theme);
    }


    public static get(name:string) : Theme
    {
        return(Themes.themes.get(name));
    }
}


export class defaultTheme implements Theme
{
    public name: "default";
    public link:string = "blue";
    public text:string = "white";
    public title:string = "white";
    public topbar:string = "blue";
    public disabled:string = "grey";
    public buttontext:string = "white";
}
