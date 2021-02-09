export interface getProtected
{
    getProtected(type?:any) : any;
}

export interface setProtected
{
    setProtected(impl:any,type?:any) : void;
}

export class Protected
{
    public static get<C>(comp:any, type?:any) : C
    {
        let impl:C = null;

        if (type == null) impl = (<getProtected><any>comp).getProtected();
        else              impl = (<getProtected><any>comp).getProtected(type);

        return(impl);
    }

    public static set(comp:any, impl:any, type?:any) : void
    {
        if (type == null) (<setProtected><any>comp).setProtected(impl);
        else              (<setProtected><any>comp).setProtected(impl,type);
    }
}