import { WindowOptions } from '../forms/WindowOptions';
import { FormDefinition } from '../forms/FormsDefinition';


export class FormDefinitions
{
    private static forms:FormDefinition[] = [];
    private static oninit:Map<string,string[]> = new Map<string,string[]>();
    private static onconn:Map<string,string[]> = new Map<string,string[]>();
    private static ondisc:Map<string,string[]> = new Map<string,string[]>();
    private static windowopts:Map<string,WindowOptions> = new Map<string,WindowOptions>();


    public static setForm(def:FormDefinition) : void
    {
        FormDefinitions.forms.unshift(def);
    }


    public static getForms() : FormDefinition[]
    {
        return(FormDefinitions.forms);
    }


    public static getWindowOpts(form:string) : WindowOptions
    {
        let wopts:WindowOptions = FormDefinitions.windowopts.get(form);

        if (wopts == null)
        {
            wopts = {};
            FormDefinitions.windowopts.set(form,wopts);
        }

        return(wopts);
    }


    public static setOnInit(form:string,func:string) : void
    {
        let funcs:string[] = FormDefinitions.oninit.get(form);
        if (funcs == null) funcs = [];
        funcs.push(func);
        FormDefinitions.oninit.set(form,funcs);
    }


    public static setOnConnect(form:string,func:string) : void
    {
        let funcs:string[] = FormDefinitions.onconn.get(form);
        if (funcs == null) funcs = [];
        funcs.push(func);
        FormDefinitions.onconn.set(form,funcs);
    }


    public static setOnDisconnect(form:string,func:string) : void
    {
        let funcs:string[] = FormDefinitions.ondisc.get(form);
        if (funcs == null) funcs = [];
        funcs.push(func);
        FormDefinitions.ondisc.set(form,funcs);
    }


    public static getOnInit(form:string) : string[]
    {
        let funcs:string[] = FormDefinitions.oninit.get(form);
        if (funcs == null) funcs = [];
        return(funcs);
    }


    public static getOnConnect(form:string) : string[]
    {
        let funcs:string[] = FormDefinitions.onconn.get(form);
        if (funcs == null) funcs = [];
        return(funcs);
    }


    public static getOnDisconnect(form:string) : string[]
    {
        let funcs:string[] = FormDefinitions.ondisc.get(form);
        if (funcs == null) funcs = [];
        return(funcs);
    }
}