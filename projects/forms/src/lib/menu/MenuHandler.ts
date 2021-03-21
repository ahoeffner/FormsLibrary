import { Form } from '../forms/Form';
import { MenuInterface } from "./MenuInterface";
import { Application } from "../application/Application";


export abstract class MenuHandler
{
    private static _id:number = 0;

    private guid$:number;
    private __menu__:MenuInterface = null;
    // dont rename __menu__ as it is set behind the scenes

    constructor()
    {
        this.guid$ = MenuHandler._id++;
    }

    public get guid() : number
    {
        return(this.guid$);
    }

    public get ready() : boolean
    {
        return(this.__menu__ != null);
    }

    public get app() : Application
    {
        return(this.__menu__.app);
    }


    public enable(menu?:string) : void
    {
        this.__menu__.enable(menu);
    }


    public disable(menu?:string) : void
    {
        this.__menu__.disable(menu);
    }

    public get connected() : boolean
    {
        return(this.__menu__.isConnected());
    }


    abstract onInit() : void;
    abstract onConnect() : void;
    abstract onDisconnect() : void;
    abstract onFormChange(form:Form) : void;
    abstract onTransactionChange() : void;
}