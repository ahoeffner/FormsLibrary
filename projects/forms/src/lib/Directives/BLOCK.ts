import { Form } from '../forms/Form';
import { Definitions } from './Definitions';


export const BLOCK = (alias:string) =>
{
    function def(form:Form, vname:string)
    {
        Definitions.setBlock(form.constructor.name,{alias: alias, prop: vname});
    }
    return(def);
}