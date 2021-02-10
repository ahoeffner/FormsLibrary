export class Utils
{
    public getName(component:any)
    {
        if (component == null) return(null);
        let name:string = component.constructor.name;

        if (name == "String") name = component;
        if (name == "Function") name = component.name;

        return(name.toLowerCase());
    }
}