export class Preferences
{
    public colors:Colors = Colors.colors;
    public environment:Environment = Environment.env;
}

class Colors
{
    public static colors:Colors = new Colors();
    public link:string = "blue";
    public text:string = "white";
    public title:string = "white";
    public topbar:string = "blue";
    public disabled:string = "grey";
    public buttontext:string = "white";
}

class Environment
{
    public static env:Environment = new Environment();
    public lang:string = Intl.DateTimeFormat().resolvedOptions().locale;
}