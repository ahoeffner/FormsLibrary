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


    public getType(component:any) : string
    {
        let type:string = null;
        let code:string = ""+component;

        if (code.startsWith("class"))
        {
            code = code.substring(0,code.indexOf("{"));
            let pos:number = code.indexOf("extends");

            if (pos > 0)
            {
                let pos1:number = code.indexOf("[",pos);
                let pos2:number = code.indexOf("]",pos1);
                type = code.substring(pos1+1,pos2);
            }
        }

        return(type);
    }
}