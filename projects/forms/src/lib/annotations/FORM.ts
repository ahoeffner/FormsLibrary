import { WindowOptions } from "../../public-api";
import { FormDefinitions } from "./FormDefinitions";
import { FormDefinition } from "../forms/FormsDefinition";


export const FORM = (component:any, title:string, path:string, navigable?:boolean, windowopts?:WindowOptions) =>
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
        if (windowopts != undefined) def["windowopts"] = windowopts;

        FormDefinitions.setForm(def);
    }
    return(def);
}