export class Container
{
    public components:any[] = [];

    public register(component:any) : void
    {
        this.components.push(component);
    }
}