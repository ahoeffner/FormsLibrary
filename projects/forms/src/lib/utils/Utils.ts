import { stringify } from "@angular/compiler/src/util";

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
                type = code.substring(pos1+2,pos2-1);
            }
        }

        return(type);
    }


    public getParams(func:any) : string[]
    {
        let code:string = func.toString();

        code = code.replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/(.)*/g, '')
        .replace(/{[\s\S]*}/, '')
        .replace(/=>/g, '')
        .trim();

        let end:number = code.length - 1;
        let start:number = code.indexOf("(") + 1;

        let params:string[] = [];
        let tokens:string[] = code.substring(start, end).split(", ");

        tokens.forEach((element) =>
        {
            // Removing any default value
            element = element.replace(/=[\s\S]*/g, '').trim();
            if(element.length > 0) params.push(element);
        });

        return(params);
    }
}