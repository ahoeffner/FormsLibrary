import { Utils } from '../utils/Utils';
import { ColumnDefinitions } from './ColumnDefinitions';
import { ColumnDefinition } from '../database/ColumnDefinition';


export const COLUMN = (name:string, type:string) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            window.alert("@COLUMN("+name+","+type+") can only be used on blocks");
            return;
        }

        let def:ColumnDefinition = {name: name, type: type};
        ColumnDefinitions.add(cname,def);
    }
    return(def);
}