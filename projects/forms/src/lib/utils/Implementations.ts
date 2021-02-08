interface impl
{
    getImplementation() : any;
}

export class Implementations
{
    public static get<C>(comp:any) : C
    {
        let impl:C = (<impl><any>comp).getImplementation();
        return(impl);
    }
}