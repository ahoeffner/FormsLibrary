import { Field } from './Field';
import { RecordState } from '../blocks/Record';
import { Application } from "../application/Application";
import { Key, keymap, KeyMapper } from '../keymap/KeyMap';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FieldDefinition, FieldOptions, Case } from './FieldDefinition';
import { FieldImplementation, FieldInterface, FieldType } from './FieldType';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #container></span>'
})


export class FieldInstance implements AfterViewInit
{
    private guid$:string;
    private def:FieldDefinition;
    private app:ApplicationImpl;
    private clazz:FieldInterface;
    private fgroup$:Field = null;
    private valid$:boolean = true;
    private enabled$:boolean = false;
    private readonly$:boolean = true;
    private mandatory$:boolean = true;
    private container:HTMLSpanElement;
    private firstchange:boolean = true;
    private state$:RecordState = RecordState.na;
    private options$:FieldOptions = {query: true, insert: true, update: true};

    @Input("id")    private id$:string = "";
    @Input("row")   private row$:number = -2;
    @Input("name")  private name$:string = "";
    @Input("block") private block$:string = "";
    @Input("group") private group$:string = "";
    @Input("class") private class$:string = "";
    @Input("style") private style$:string = "";
    @Input("size")  private size$:number = null;

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

    public get fname() : string
    {
        let name:string = this.block$+"."+this.name;
        if (this.id.length > 0) name += "."+this.id;
        name += "["+this.row+"]";
        return(name);
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

    public get fieldoptions() : FieldOptions
    {
        return(this.options$);
    }

    public get enabled() : boolean
    {
        return(this.enabled$);
    }

    public get state() : RecordState
    {
        return(this.state$);
    }

    public set state(state:RecordState)
    {
        this.state$ = state;
    }

    public set readonly(flag:boolean)
    {
        this.readonly$ = flag;
    }

    public get readonly() : boolean
    {
        return(this.readonly$);
    }

    public get mandatory() : boolean
    {
        return(this.mandatory$);
    }

    public set mandatory(flag:boolean)
    {
        this.mandatory$ = flag;
        if (flag) this.addClass("mandatory");
        else      this.removeClass("mandatory");
    }

    public focus() : boolean
    {
        if (!this.enabled) return(false);
        if (this.clazz == null) return(false);
        setTimeout(() => {this.clazz.element.focus()},0);
        return(true);
    }

    public blur() : void
    {
        console.log(this.fname+" blur");
        if (this.clazz != null)
            setTimeout(() => {this.clazz.element.blur()},0);
    }

    public addClass(clazz:string) : void
    {
        if (this.clazz != null)
            this.clazz.element.classList.add(clazz);
    }

    public removeClass(clazz:string) : void
    {
        if (this.clazz != null)
            this.clazz.element.classList.remove(clazz);
    }

    public get current() : boolean
    {
        return(this.guid.startsWith("c"));
    }

    public set value(value:any)
    {
        if (this.clazz != null) this.clazz.value = value;
    }

    public get valid() : boolean
    {
        return(this.valid$);
    }

    public set valid(flag:boolean)
    {
        if (flag == this.valid$)
            return;

        if (flag)
        {
            this.valid$ = flag;
            this.removeClass("invalid");
        }
        else
        {
            if (this.enabled && !this.readonly)
            {
                this.valid$ = flag;
                this.addClass("invalid");
            }
        }
    }

    public enable()
    {
        this.setInputState();
    }

    public disable() : void
    {
        this.valid = true;
        this.enabled$ = false;
        this.readonly$ = false;
        this.state = RecordState.na;

        if (this.clazz != null)
        {
            this.clazz.enable = false;
            this.clazz.readonly = false;
        }
    }

    private setInputState() : void
    {
        this.enabled$ = false;

        if (this.state$ == RecordState.na) this.enabled$ = true;
        else if (this.state$ == RecordState.qmode && this.options$.query) this.enabled$ = true;
        else if (this.state$ == RecordState.insert && this.options$.insert) this.enabled$ = true;
        else if (this.state$ == RecordState.update && this.options$.update) this.enabled$ = true;

        if (this.clazz != null)
        {
            if (!this.enabled$ && this.state$ == RecordState.update)
            {
                this.enabled$ = true;
                this.readonly$ = true;
            }

            this.clazz.enable = this.enabled$;
            this.clazz.readonly = this.readonly$;
        }
    }

    public set definition(def:FieldDefinition)
    {
        this.def = def;
        this.setType(def.type);

        if (!this.def.hasOwnProperty("case"))
            this.def.case = Case.mixed;

        if (this.def.hasOwnProperty("mandatory"))
            this.mandatory = this.def.mandatory;

        if (this.def.fieldoptions != null)
        {
            this.options$ = this.def.fieldoptions;
            if (!this.options$.hasOwnProperty("query"))  this.options$.query = true;
            if (!this.options$.hasOwnProperty("insert")) this.options$.insert = true;
            if (!this.options$.hasOwnProperty("update")) this.options$.update = true;
        }
    }


    private setType(type:FieldType) : void
    {
        this.container.innerHTML = null;
        let cname:any = FieldImplementation.getClass(type.name);

        if (cname != null)
        {
            this.clazz = new cname();

            this.container.innerHTML = this.clazz.html;
            this.clazz.element = this.container.children[0] as HTMLElement;

            if (this.size$ != null) this.clazz.size = this.size$;
            if (this.class$ != "") this.clazz.element.classList.add(this.class$);
            if (this.style$ != "") this.clazz.element.style.cssText = this.style$;

            this.addTriggers();
            this.setInputState();
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
        {
            if (this.enabled && !this.readonly && this.mandatory && !this.firstchange)
            {
                if (this.value == null || (""+this.value).length == 0)
                    if (this.valid) this.fgroup$.valid = false;
            }

            this.fgroup$["onEvent"](event,this,"blur");
        }

        if (event.type == "change")
        {
            if (this.enabled && !this.readonly)
            if (!this.valid) this.fgroup$.valid = true;

            this.value = this.value.trim();

            if (this.enabled && !this.readonly && this.mandatory)
            {
                if (this.value == null || (""+this.value).length == 0)
                if (this.valid) this.fgroup$.valid = false;
            }

            this.fgroup$["onEvent"](event,this,"change");
        }

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
            if (this.readonly) return;

            if (this.def.type == FieldType.number)
                this.valnumber(event);

            if (this.def.type == FieldType.decimal)
                this.valdecimal(event);

            if (this.def.case == Case.lower)
                setTimeout(() => {this.value = (""+this.value).toLowerCase();},0);

            if (this.def.case == Case.upper)
                setTimeout(() => {this.value = (""+this.value).toUpperCase();},0);

            if (this.firstchange)
            {
                this.firstchange = false;
                if (!this.valid) this.fgroup$.valid = true;
                this.fgroup$["onEvent"](event,this,"fchange");
            }

            setTimeout(() => {this.fgroup$.onEvent(event,this,"ichange");},1);
        }
    }


    private valnumber(event:any, value?:string) : void
    {
        if (this.state == RecordState.qmode)
            return;

        if (value == null)
        {
            value = this.value+"";
            setTimeout(() => {this.valnumber(event,value)},0);
            return;
        }

        let nvalue:string = this.value;

        if (nvalue.trim().length == 0)
            return;

        let numeric:boolean = !isNaN(+nvalue);

        if (!numeric || nvalue.indexOf(".") >= 0)
        {
            setTimeout(() =>
            {
                this.value = value;
                this.fgroup$.onEvent(event,this,"ichange");
            }
            ,0);
        }
    }


    private valdecimal(event:any, value?:string) : void
    {
        if (this.state == RecordState.qmode)
            return;

        if (value == null)
        {
            value = this.value+"";
            setTimeout(() => {this.valdecimal(event,value)},0);
            return;
        }

        let nvalue:string = this.value;

        if (nvalue.trim().length == 0)
            return;

        let numeric:boolean = !isNaN(+nvalue);

        if (!numeric)
        {
            setTimeout(() =>
            {
                this.value = value;
                this.fgroup$.onEvent(event,this,"ichange");
            }
            ,0);
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