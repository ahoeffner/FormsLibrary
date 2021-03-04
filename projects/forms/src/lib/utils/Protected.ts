export interface getProtected
{
    _getProtected(type?:any) : any;
}

export interface setProtected
{
    _setProtected(args:any,type?:any) : void;
}

export class ProtectedX
{
    public static get<C>(comp:any, type?:any) : C
    {
        let impl:C = null;

        if (type == null) impl = (<getProtected><any>comp)._getProtected();
        else              impl = (<getProtected><any>comp)._getProtected(type);

        return(impl);
    }

    public static set(comp:any, args:any, type?:any) : void
    {
        if (type == null) (<setProtected><any>comp)._setProtected(args);
        else              (<setProtected><any>comp)._setProtected(args,type);
    }
}