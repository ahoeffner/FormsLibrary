import { Menu } from "../menu/Menu";
import { FormImpl } from "./FormImpl";
import { Block } from "../blocks/Block";
import { Trigger } from "../events/Triggers";
import { Theme } from "../application/Themes";
import { BlockImpl } from "../blocks/BlockImpl";
import { Statement } from "../database/Statement";
import { Container } from "../container/Container";
import { TriggerFunction } from "../events/TriggerFunction";
import { Component, AfterViewInit, OnInit } from "@angular/core";


export interface CallBack
{
    (form:Form, cancel:boolean) : void;
}


@Component({template: ''})


export class Form implements OnInit, AfterViewInit
{
    private _impl_:FormImpl;
    // dont rename impl as it is read behind the scenes

    constructor()
    {
        this._impl_ = new FormImpl(this);
    }

    public get name() : string
    {
        return(this.constructor.name);
    }

    public set title(title:string)
    {
        this._impl_.title = title;
    }

    public get title() : string
    {
        return(this._impl_.title);
    }

    public set menu(menu:Menu)
    {
        this._impl_.setMenu(menu);
    }

    public get menu()
    {
        return(this._impl_.getMenu());
    }

    public focus() : void
    {
        this._impl_.focus();
    }

    public get block() : Block
    {
        return(this._impl_.block?.block);
    }

    public get popup() : boolean
    {
        return(this._impl_.popup);
    }

    public get colors() : Theme
    {
        return(this._impl_.getApplication().config.colors);
    }

    public getRowIndicator(block:string, row:number) : string
    {
        if (row == this.getCurrentRow(block)) return(this.colors.rowindicator);
        return("");
    }

    public getCurrentRow(block:string) : number
    {
        return(this._impl_.getCurrentRow(block));
    }

    public getCurrentRecord(block:string) : number
    {
        return(this._impl_.getCurrentRecord(block));
    }

    public getBlock(block:string) : Block
    {
        let impl:BlockImpl = this._impl_.getBlock(block);
        if (impl != null) return(impl.block);
        return(null);
    }

    public newform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.showform(form,true,parameters);
    }

    public showform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.showform(form,false,parameters);
    }

    public callform(form:any, parameters?:Map<string,any>) : void
    {
        this._impl_.callform(form,false,parameters);
    }

    public getCallStack() : Form[]
    {
        return(this._impl_.getCallStack());
    }

    public clearCallStack() : void
    {
        this._impl_.clearStack();
    }

    public get parameters() : Map<string,any>
    {
        return(this._impl_.getParameters());
    }

    public cancelled() : boolean
    {
        return(this._impl_.wasCancelled());
    }

    public clear() : void
    {
        this._impl_.clear();
    }

    public cancel() : void
    {
        this._impl_.cancel();
    }

    public close(dismiss?:boolean) : void
    {
        this._impl_.close(dismiss);
    }

    public setCallback(func:CallBack) : void
    {
        this._impl_.setCallback(func);
    }

    public addTrigger(func:TriggerFunction, types?:Trigger|Trigger[]) : void
    {
        this._impl_.addTrigger(this,func,types);
    }


    public addKeyTrigger(func:TriggerFunction, keys?:string|string[]) : void
    {
        this._impl_.addKeyTrigger(this,func,keys);
    }


    public async execute(stmt:Statement, firstrow?:boolean, firstcolumn?:boolean) : Promise<any>
    {
        return(this._impl_.execute(stmt,firstrow,firstcolumn));
    }


    public addFieldTrigger(listener:TriggerFunction, types:Trigger|Trigger[], fields?:string|string[]) : void
    {
        this._impl_.addFieldTrigger(this,listener,types,fields);
    }

    public ngOnInit()
    {
        this._impl_.getApplication().setContainer();
    }

    public ngAfterViewInit(): void
    {

        let container:Container = this._impl_.getApplication().getContainer();
        this._impl_.getApplication().dropContainer();
        this._impl_.newForm(container);
    }


    public alert(message:string, title?:string, width?:string, height?:string) : void
    {
        if (title == null) title = this.name;
        this._impl_.alert(message,title,width,height);
    }
}