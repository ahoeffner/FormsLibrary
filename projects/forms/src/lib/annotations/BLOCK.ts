import { Form } from '../forms/Form';
import { BlockDefinitions } from './BlockDefinitions';


export const BLOCK = (alias:string) =>
{
    function def(form:Form, vname:string)
    {
        BlockDefinitions.setBlock(form.constructor.name,{alias: alias, prop: vname});
    }
    return(def);
}