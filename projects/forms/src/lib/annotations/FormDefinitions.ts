import { FormDefinition } from '../forms/FormsDefinition';


export class FormDefinitions
{
    private static forms:FormDefinition[] = [];
    private static oninit:Map<string,string> = new Map<string,string>();
    private static onconn:Map<string,string> = new Map<string,string>();
    private static ondisc:Map<string,string> = new Map<string,string>();


    public static setForm(def:FormDefinition) : void
    {
        FormDefinitions.forms.unshift(def);
    }


    public static getForms() : FormDefinition[]
    {
        return(FormDefinitions.forms);
    }


    public static setOnInit(form:string,func:string) : void
    {
        FormDefinitions.oninit.set(form,func);
    }


    public static setOnConnect(form:string,func:string) : void
    {
        FormDefinitions.onconn.set(form,func);
    }


    public static setOnDisconnect(form:string,func:string) : void
    {
        FormDefinitions.ondisc.set(form,func);
    }
}