import { Field } from './Field';
import { Case } from './FieldDefinition';
import { RecordState } from '../blocks/Record';
import { Key, keymap, KeyMapper } from '../keymap/KeyMap';
import { Application } from "../application/Application";
import { FieldOption, FieldOptions } from './FieldOptions';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FieldImplementation, FieldInterface, FieldType } from './FieldType';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #container></span>'
})


export class FieldInstance implements AfterViewInit
{
    private guid$:string;
    private type$:FieldType;
    private app:ApplicationImpl;
    private clazz:FieldInterface;
    private fgroup$:Field = null;
    private case$:Case = Case.mixed;
    private enabled$:boolean = false;
    private container:HTMLSpanElement;
    private readonly$:boolean = false;
    private firstchange:boolean = true;
    private options$:FieldOptions = {query: true, insert: true, update: true};

    @Input("id")    private id$:string = "";
    @Input("row")   private row$:number = -2;
    @Input("name")  private name$:string = "";
    @Input("block") private block$:string = "";
    @Input("group") private group$:string = "";
    @Input("class") private class$:string = "";
    @Input("style") private style$:string = "";

    @ViewChild("container", {read: ElementRef}) private containerelem: ElementRef;


    constructor(app:Application)
    {
        this.app = app["_impl_"];
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

    public get type() : FieldType
    {
        return(this.type$);
    }

    public get dirty() : boolean
    {
        return(this.dirty);
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

    public set fieldoptions(options:FieldOptions)
    {
        if (options != null)
        {
            this.options$ = options;
            if (!this.options$.hasOwnProperty("query")) options.query = true;
            if (!this.options$.hasOwnProperty("insert")) options.insert = true;
            if (!this.options$.hasOwnProperty("update")) options.update = true;
        }
    }

    public get fieldoptions() : FieldOptions
    {
        return(this.options$);
    }

    public focus() : void
    {
        if (this.clazz != null)
            setTimeout(() => {this.clazz.element.focus()},0);
    }

    public blur() : void
    {
        if (this.clazz != null)
            setTimeout(() => {this.clazz.element.blur()},0);
    }

    public get current() : boolean
    {
        return(this.guid.startsWith("c"));
    }

    public set case(type:Case)
    {
        this.case$ = type;
        if (type == null) this.case$ = Case.mixed;
    }

    public set value(value:any)
    {
        if (this.clazz != null)
            this.clazz.value = value;
    }

    public get enabled() : boolean
    {
        return(this.enabled$);
    }

    public disable() : void
    {
        this.enabled$ = false;
        if (this.clazz != null) this.clazz.enable = false;
    }


    public enable(state:RecordState)
    {
        let enable:boolean = false;
        if (state == RecordState.na) enable = true;
        else if (state == RecordState.qmode && this.options$.query) enable = true;
        else if (state == RecordState.insert && this.options$.insert) enable = true;
        else if (state == RecordState.update && this.options$.update) enable = true;
        if (enable && this.clazz != null)
        {
            this.enabled$ = true;
            this.clazz.enable = true;
        }
    }


    public set readonly(flag:boolean)
    {
        this.readonly$ = flag;
        if (this.clazz != null) this.clazz.rdonly = flag;
    }


    public set restrict(restrict:FieldOptions)
    {
        this.options$ = FieldOption.restrict(this.options$,restrict);
    }


    public set type(type:FieldType)
    {
        this.type$ = type;
        this.container.innerHTML = null;
        let cname:any = FieldImplementation.getClass(type.name);

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


    public async onEvent(event:any)
    {
        let keypress:boolean = false;

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

        if (event.type == "keydown" && event.keyCode == 8)
            keypress = true;

        if (event.type == "keydown" && !keypress)
        {
            if (+event.keyCode >= 16 && +event.keyCode <= 20)
                return;

            let keydef:Key =
            {
                code  : event.keyCode,
                alt   : event.altKey,
                ctrl  : event.ctrlKey,
                meta  : event.metaKey,
                shift : event.shiftKey
            }

            let key:string = KeyMapper.map(keydef);
            let mapped:string = KeyMapper.keyname(key);

            if (mapped != null)
            {
                // handled by application
                if
                (
                    key == keymap.connect         ||
                    key == keymap.disconnect      ||
                    key == keymap.delete          ||
                    key == keymap.insertafter     ||
                    key == keymap.insertbefore    ||
                    key == keymap.enterquery      ||
                    key == keymap.executequery
                )
                return;

                this.fgroup$["onEvent"](event,this,"key",key);
            }
        }

        if (event.type == "keypress" || keypress)
        {
            if (this.readonly$) return;
            
            if (this.case$ == Case.lower)
                setTimeout(() => {this.value = (""+this.value).toLowerCase();},0);

            if (this.case$ == Case.upper)
                setTimeout(() => {this.value = (""+this.value).toUpperCase();},0);

            if (this.firstchange)
            {
                this.firstchange = false;
                this.fgroup$["onEvent"](event,this,"fchange");
            }

            setTimeout(() => {this.fgroup$.onEvent(event,this,"ichange");},1);
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