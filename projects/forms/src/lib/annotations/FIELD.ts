import { Utils } from '../utils/Utils';
import { FieldDefinitions } from './FieldDefinitions';
import { FieldDefinition } from '../input/FieldDefinition';


export const field = (definition:FieldDefinition) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            window.alert("@field("+JSON.stringify(definition.name)+") can only be used on blocks");
            return;
        }

        FieldDefinitions.add(cname,definition);
    }
    return(def);
}