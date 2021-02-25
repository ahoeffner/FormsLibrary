import { Form } from '../forms/Form';
import { MenuInterface } from "./MenuInterface";
import { Transaction } from '../database/Transaction';
import { Application } from "../application/Application";


export abstract class MenuHandler
{
    private ready$:boolean = false;
    private menu$:MenuInterface = null;

    constructor()
    {
        Reflect.defineProperty(this,"_setProtected", {value: (intf:MenuInterface) =>
        {
            this.menu$ = intf;
            this.ready$ = true;
        }});
    }

    public get ready() : boolean
    {
        return(this.ready$);
    }


    public get app() : Application
    {
        return(this.menu$.app);
    }


    public enable(menu?:string) : void
    {
        this.menu$.enable(menu);
    }


    public disable(menu?:string) : void
    {
        this.menu$.disable(menu);
    }

    public get connected() : boolean
    {
        return(this.menu$.isConnected());
    }


    abstract onInit() : void;
    abstract onConnect() : void;
    abstract onDisconnect() : void;
    abstract onFormChange(form:Form) : void;
    abstract onTransactio(action:Transaction) : void;
}