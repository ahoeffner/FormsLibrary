import { Utils } from "../utils/Utils";
import { FormInstance } from "./FormInstance";
import { WindowOptions } from "./WindowOptions";
import { FormDefinition } from "../../public-api";


export class FormUtil
{
    private utils:Utils = new Utils();

    public complete(options:WindowOptions, create?:boolean) : WindowOptions
    {
        if (options == null)
        {
            if (create) options = {};
            else        return(null);
        }

        if (!options.hasOwnProperty("width")) options.width = "500px";
        if (!options.hasOwnProperty("height")) options.height = "300px";
        if (!options.hasOwnProperty("offsetTop")) options.offsetTop = "10vh";
        if (!options.hasOwnProperty("offsetLeft")) options.offsetLeft = "20vw";
        return(options);
    }


    public convert(form:FormDefinition) : FormInstance
    {
        let fname:string = this.utils.getName(form.component);

        let navigable:boolean = true;

        form.modal = this.complete(form.modal);
        if (form.hasOwnProperty("navigable")) navigable = form.navigable;

        let path:string = "/"+fname;
        if (form.hasOwnProperty("path")) path = form.path;

        path = path.trim();
        if (!path.startsWith("/")) path = "/" + path;

        let def:FormInstance =
        {
            name: fname,
            path: form.path,
            title: form.title,
            navigable: navigable,
            windowdef: form.modal,
            windowopts: form.modal,
            component: form.component,
        };

        return(def);
    }


    public clone(base:FormInstance) : FormInstance
    {
        let clone:FormInstance =
        {
            name: base.name,
            path: base.path,
            title: base.title,
            windowdef: base.windowdef,
            windowopts: base.windowdef,
            component: base.component,
            navigable: base.navigable
        }
        return(clone);
    }
}