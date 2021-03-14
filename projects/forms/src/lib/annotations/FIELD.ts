import { Utils } from '../utils/Utils';
import { FieldDefinition } from '../input/FieldDefinition';
import { FieldDefinitions } from './FieldDefinitions';

export const FIELD = (name:string, type:string) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block" && ctype != "ControlBlock")
        {
            window.alert("@FIELD("+name+","+type+") can only be used on blocks");
            return;
        }

        console.log("Adding field to "+cname);
        let def:FieldDefinition = {name: name, type: type};
        FieldDefinitions.add(cname,def);
    }
    return(def);
}