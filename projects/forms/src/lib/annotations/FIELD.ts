import { Utils } from '../utils/Utils';
import { FieldDefinitions } from './FieldDefinitions';
import { FieldDefinition } from '../input/FieldDefinition';


export const field = (definition:FieldDefinition) =>
{
    function define(comp:any)
    {
        let form:boolean = false;
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block" && ctype != "Form")
        {
            console.log("@field("+JSON.stringify(definition.name)+") can only be used on blocks and forms");
            return;
        }

        if (ctype == "Form") form = true;
        FieldDefinitions.add(form,cname,definition);
    }

    return(define);
}