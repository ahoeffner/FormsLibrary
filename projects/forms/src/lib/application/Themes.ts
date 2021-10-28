export interface Theme
{
    name:string;
    link:string;
    text:string;
    title:string;
    topbar:string;
    enabled:string;
    disabled:string;
    foldertree:string;
    buttontext:string;
    menuoption:string;
    rowindicator:string;
}

export class defaultTheme implements Theme
{
    public name:string = "default";

    public link:string = "blue";
    public text:string = "black";
    public title:string = "white";
    public topbar:string = "#303f9f";
    public enabled:string = "white";
    public disabled:string = "silver";
    public menuoption:string = "white";
    public buttontext:string = "white";
    public foldertree:string = "#303f9f";
    public rowindicator:string = "#303f9f";
}


export class Indigo extends defaultTheme
{
    public name:string = "indigo";
}


export class Grey extends defaultTheme
{
    public name:string = "grey";
    public link:string = "grey";
    public topbar:string = "grey";
    public foldertree:string = "grey";
    public rowindicator:string = "grey";
}


export class Pink extends defaultTheme
{
    public name:string = "pink";
    public link:string = "#ff4081";
    public topbar:string = "#ff4081";
    public foldertree:string = "#ff4081";
    public rowindicator:string = "#ff4081";
}


export class Yellow implements Theme
{
    public name:string = "yellow";

    public link:string = "grey";
    public text:string = "black";
    public title:string = "black";
    public topbar:string = "yellow";
    public foldertree:string = "grey";
    public enabled:string = "black";
    public disabled:string = "silver";
    public menuoption:string = "black";
    public buttontext:string = "black";
    public rowindicator:string = "yellow";
}
