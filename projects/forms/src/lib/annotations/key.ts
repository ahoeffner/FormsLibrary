import { Utils } from '../utils/Utils';
import { KeyDefinition } from './KeyDefinition';
import { BlockDefinitions } from './BlockDefinitions';


export const key = (name:string, unique:boolean, columns:string|string[]) =>
{
    function define(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            console.log("@key("+name+") can only be used on blocks");
            return;
        }

        let arr:boolean = true;
        let cols:string[] = [];

        if (columns.constructor.name == "String")
            arr = false;

        if (arr) cols = columns as string[];
        else     cols.push(columns as string);

        let lccols:string[] = [];
        cols.forEach((col) => {lccols.push(col.toLowerCase())});

        let def:KeyDefinition = {name: name.toLowerCase(), unique: unique, columns: lccols}
        BlockDefinitions.setKey(cname,def);
    }
    return(define);
}