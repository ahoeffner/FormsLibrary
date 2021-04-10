import { Form } from "../forms/Form";
import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";


export const connect = (form:Form, func?:string) =>
{
    let utils:Utils = new Utils();
    let fname:string = utils.getName(form);
    let ctype:string = utils.getType(form);

    if (ctype != "Form")
    {
        console.log("@connect can only be used on forms");
        return;
    }

    FormDefinitions.setOnConnect(fname,func);
}