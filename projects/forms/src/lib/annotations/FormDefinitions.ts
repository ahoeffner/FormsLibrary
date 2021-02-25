import { Utils } from '../utils/Utils';
import { FormDefinition } from '../forms/FormsDefinition';


export class FormDefinitions
{
    private static forms:FormDefinition[] = [];


    public static setForm(def:FormDefinition) : void
    {
        FormDefinitions.forms.unshift(def);
    }


    public static getForms() : FormDefinition[]
    {
        return(FormDefinitions.forms);
    }
}