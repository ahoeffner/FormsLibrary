import { Field } from './Field';
import { Config } from '../application/Config';
import { Key, KeyMapper } from '../keymap/KeyMap';
import { FieldTypes, FieldType } from './FieldType';
import { Application } from "../application/Application";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #container></span>'
})


export class FieldInstance implements AfterViewInit
{
    private type$:string;
    private guid$:string;
    private clazz:FieldType;
    private app:ApplicationImpl;
    private fgroup$:Field = null;
    private upper:boolean = false;
    private lower:boolean = false;
    private container:HTMLSpanElement;
    private firstchange:boolean = true;

    @Input("id")    private id$:string = "";
    @Input("row")   private row$:number = -2;
    @Input("name")  private name$:string = "";
    @Input("block") private block$:string = "";
    @Input("group") private group$:string = "";
    @Input("class") private class$:string = "";
    @Input("style") private style$:string = "";

    @ViewChild("container", {read: ElementRef}) private containerelem: ElementRef;


    constructor(private conf:Config, app:Application)
    {
        this.app = app["impl"];
    }

    public get id() : string
    {
        return(this.id$);
    }

    public get row() : number
    {
        return(this.row$);
    }

    public set row(row:number)
    {
        this.row$ = row;
    }

    public set seq(seq:number)
    {
        if (this.clazz != null)
        this.clazz.tabindex = seq;
    }

    public get seq() : number
    {
        if (this.clazz == null) return(0);
        else return(this.clazz.tabindex);
    }

    public get name() : string
    {
        return(this.name$);
    }

    public get type() : string
    {
        return(this.type$);
    }

    public set guid(guid:string)
    {
        this.guid$ = guid;
    }

    public get guid() : string
    {
        return(this.guid$);
    }

    public get block() : string
    {
        return(this.block$);
    }

    public get group() : string
    {
        return(this.group$);
    }

    public get value() : any
    {
        if (this.clazz == null) return("");
        else return(this.clazz.value);
    }

    public get field() : Field
    {
        return(this.fgroup$);
    }

    public set field(field:Field)
    {
        this.fgroup$ = field;
    }

    public focus() : void
    {
        if (this.clazz != null)
        setTimeout(() => {this.clazz.element.focus()},0);
    }

    public setUpperCase() : void
    {
        this.upper = true;
        this.lower = false;
    }

    public setLowerCase() : void
    {
        this.lower = true;
        this.upper = false;
    }

    public set value(value:any)
    {
        if (this.clazz != null)
        this.clazz.value = value;
    }


    public get enabled() : boolean
    {
        if (this.clazz == null) return(false);
        else return(this.clazz.enable);
    }


    public set enable(flag:boolean)
    {
        if (this.clazz != null)
        this.clazz.enable = flag;
    }


    public set readonly(flag:boolean)
    {
        if (this.clazz != null)
        this.clazz.rdonly = flag;
    }


    public set type(type:string)
    {
        this.type$ = type;
        this.container.innerHTML = null;
        let cname:any = FieldTypes.getClass(type);

        if (cname != null)
        {
            this.clazz = new cname();
            this.container.innerHTML = this.clazz.html;
            this.clazz.element = this.container.children[0] as HTMLElement;
            if (this.class$ != "") this.clazz.element.classList.add(this.class$);
            if (this.style$ != "") this.clazz.element.style.cssText = this.style$;
            this.addTriggers();
        }
    }


    public onEvent(event:any)
    {
        if (this.fgroup$ == null)
            return;

        if (event.type == "focus")
        {
            this.firstchange = true;
            this.fgroup$["onEvent"](event,this,"focus");
        }

        if (event.type == "blur")
            this.fgroup$["onEvent"](event,this,"blur");

        if (event.type == "change")
            this.fgroup$["onEvent"](event,this,"change");

        if (event.type == "keydown")
        {
            let skip:boolean = false;
            if (+event.keyCode >= 48 && +event.keyCode <= 90) skip = true;
            if (+event.keyCode >= 16 && +event.keyCode <= 20) skip = true;

            if (!skip)
            {
                let keydef:Key =
                {
                    code  : event.keyCode,
                    alt   : event.altKey,
                    ctrl  : event.ctrlKey,
                    meta  : event.metaKey,
                    shift : event.shiftKey
                }

                let key:string = KeyMapper.map(keydef);
                let mapped:string = this.conf.mapkey(key);
                if (mapped != null) this.fgroup$["onEvent"](event,this,"key",key);
            }
        }

        if (event.type == "keypress")
        {
            if (this.lower)
                this.value = (""+this.value).toLowerCase();

            if (this.upper)
                this.value = (""+this.value).toUpperCase();

            if (this.firstchange)
            {
                this.firstchange = false;
                this.fgroup$["onEvent"](event,this,"fchange");
            }

            this.fgroup$.onEvent(event,this,"ichange");
        }
    }


    public ngAfterViewInit(): void
    {
		this.container = this.containerelem?.nativeElement as HTMLSpanElement;

        this.id$ = this.id$.toLowerCase();
        this.name$ = this.name$.toLowerCase();
        this.block$ = this.block$.toLowerCase();

        this.app.getContainer().register(this);
    }


    private addTriggers() : void
    {
        let impl:Node = this.container.firstChild;

        if (impl == null) return;
        impl.addEventListener("blur", (event) => {this.onEvent(event)});
        impl.addEventListener("focus", (event) => {this.onEvent(event)});
        impl.addEventListener("change", (event) => {this.onEvent(event)});
        impl.addEventListener("onclick", (event) => {this.onEvent(event)});
        impl.addEventListener("keydown", (event) => {this.onEvent(event)});
        impl.addEventListener("keypress", (event) => {this.onEvent(event)});
        impl.addEventListener("ondblclick", (event) => {this.onEvent(event)});
    }
}