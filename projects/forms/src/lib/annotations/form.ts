import { FormDefinitions } from "./FormDefinitions";
import { FormDefinition } from "../forms/FormsDefinition";


export const form = (component:any, title:string, path:string, navigable?:boolean) =>
{
    function define(_comp:any)
    {
        let def:FormDefinition =
        {
            path: path,
            title: title,
            component: component,
        };

        if (navigable != undefined) def["navigable"] = navigable;

        FormDefinitions.setForm(def);
    }
    return(define);
}