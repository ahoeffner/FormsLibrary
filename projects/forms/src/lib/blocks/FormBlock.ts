import { Form } from '../forms/Form';

export const FormBlock = (alias:string) =>
{
    function def(form:Form, vname:string)
    {
        form.setBlock(vname,alias);
    }
    return(def);
}