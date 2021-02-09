interface impl
{
    getImplementation() : any;
    setImplementation(impl:any) : void;
}

export class Implementations
{
    public static get<C>(comp:any) : C
    {
        let impl:C = (<impl><any>comp).getImplementation();
        return(impl);
    }

    public static set<C>(comp:any, impl:any) : void
    {
        (<impl><any>comp).setImplementation(impl);
    }
}