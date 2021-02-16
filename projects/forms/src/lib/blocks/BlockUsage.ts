import { Form } from '../forms/Form';
import { BlockDefinition } from './BlockDefinition';


export const BlockUsage = (alias:string) =>
{
    function def(form:Form, vname:string)
    {
        console.log("alias: "+alias+" name: "+vname+" form="+form.constructor.name);
        BlockDefinitions.blocks.push({form: form, name: alias, vname: vname});
    }
    return(def);
}

export class BlockDefinitions
{
    public static blocks:BlockDefinition[] = [];
}