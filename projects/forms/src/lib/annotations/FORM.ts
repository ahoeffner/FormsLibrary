import { WindowOptions } from "../../public-api";
import { FormDefinitions } from "./FormDefinitions";
import { FormDefinition } from "../forms/FormsDefinition";


export const FORM = (component:any, title:string, path:string, navigable?:boolean) =>
{
    function def(_target:any)
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
    return(def);
}