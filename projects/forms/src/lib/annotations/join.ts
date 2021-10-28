import { Utils } from '../utils/Utils';
import { JOINDefinition, JOINDefinitions } from './JOINDefinitions';


export const join = (definition:JOINDefinition) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let form:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Form")
        {
            console.log("@join("+JSON.stringify(definition)+") can only be used on forms");
            return;
        }

        definition.master.key = definition.master.key.toLowerCase();
        definition.master.alias = definition.master.alias.toLowerCase();

        definition.detail.key = definition.detail.key.toLowerCase();
        definition.detail.alias = definition.detail.alias.toLowerCase();

        JOINDefinitions.add(form.toLowerCase(),definition);
    }

    return(define);
}