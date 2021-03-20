import { Form } from "../forms/Form";
import { Utils } from "../utils/Utils";
import { FormDefinitions } from "./FormDefinitions";


export const hide = (form:Form, func?:string) =>
{
    let utils:Utils = new Utils();
    let fname:string = utils.getName(form);
    FormDefinitions.setOnHide(fname,func);
}