import { Form } from "../forms/Form";
import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";


export const show = (form:Form, func?:string) =>
{
    let utils:Utils = new Utils();
    let fname:string = utils.getName(form);
    let ctype:string = utils.getType(form);

    if (ctype != "Form")
    {
        console.log("@show can only be used on forms, found on '"+fname+"'");
        return;
    }

    FormDefinitions.setOnShow(fname,func);
}