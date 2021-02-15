export interface CallBack
{
    _callback(type?:any) : void;
}

export interface getProtected
{
    _getProtected(type?:any) : any;
}

export interface setProtected
{
    _setProtected(impl:any,type?:any) : void;
}

export class Protected
{
    public static get<C>(comp:any, type?:any) : C
    {
        let impl:C = null;

        if (type == null) impl = (<getProtected><any>comp)._getProtected();
        else              impl = (<getProtected><any>comp)._getProtected(type);

        return(impl);
    }

    public static set(comp:any, impl:any, type?:any) : void
    {
        if (type == null) (<setProtected><any>comp)._setProtected(impl);
        else              (<setProtected><any>comp)._setProtected(impl,type);
    }

    public static callback(comp:any, args:any) : void
    {
        (<CallBack><any>comp)._callback(args);
    }
}