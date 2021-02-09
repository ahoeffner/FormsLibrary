export class Parameters
{
    private params:Map<string,any> =
        new Map<string,any>();

    public set(key:string, value:any) : void
    {
        this.params.set(key,value);
    }

    public remove(key:string) : boolean
    {
        return(this.params.delete(key));
    }

    public clear() : void
    {
        this.params.clear();
    }

    public getAll() : Map<string,any>
    {
        return(this.params);
    }
}