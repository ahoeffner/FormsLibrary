import { Field } from './Field';
import { CheckBox } from './CheckBox';
import { Case } from '../database/Case';
import { RadioButton } from './RadioButton';
import { KeyCodes } from '../keymap/KeyCodes';
import { RecordState } from '../blocks/Record';
import { Context } from '../application/Context';
import { Key, keymap, KeyMapper } from '../keymap/KeyMap';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FieldDefinition, FieldOptions } from './FieldDefinition';
import { FieldImplementation, FieldInterface, FieldType } from './FieldType';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #container></span>'
})


export class FieldInstance implements AfterViewInit
{
    private lvalue:any;
    private guid$:string;
    private def:FieldDefinition;
    private app:ApplicationImpl;
    private clazz:FieldInterface;
    private fgroup$:Field = null;
    private valid$:boolean = true;
    private lvalid:boolean = true;
    private enforce:boolean = false;
    private enabled$:boolean = false;
    private readonly$:boolean = false;
    private mandatory$:boolean = false;
    private firstchange:boolean = true;
    private values:Map<string,any> = null;
    private container:HTMLSpanElement = null;
    private state$:RecordState = RecordState.na;
    private options$:FieldOptions = {query: true, insert: true, update: true, navigable: true};

    @Input("id")    private id$:string = "";
    @Input("row")   private row$:number = -1;
    @Input("name")  private name$:string = "";
    @Input("block") private block$:string = "";
    @Input("group") private group$:string = "";
    @Input("class") private class$:string = "";
    @Input("style") private style$:string = "";
    @Input("size")  private size$:number = null;
    @Input("value") private value$:string = null;

    @ViewChild("container", {read: ElementRef}) private containerelem: ElementRef;


    constructor(ctx:Context)
    {
        this.app = ctx.app["_impl_"];
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
        //name += "["+this.row+"]("+this.guid+")";
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
        if (this.clazz == null) return(null);

        let value:any = this.clazz.value;
        if ((""+value).trim().length == 0) value = null;

        return(value);
    }

    public get parent() : Field
    {
        return(this.fgroup$);
    }

    public set parent(field:Field)
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

    public setPossibleValues(values:Set<any>|Map<string,any>, enforce:boolean) : void
    {
        this.enforce = enforce;
        let type:string = this.clazz.constructor.name;

        if (type == "DropDown") this.setDropDownValues(values);
        if (type == "TextField") this.setTextFieldValues(values);
    }

    private setTextFieldValues(values:Set<any>|Map<string,any>) : void
    {
        let name:string = this.block+"."+this.name;
        if (this.id.length > 0) name += "."+this.id;
        let list:HTMLElement = document.getElementById(name);

        if (list == null)
        {
            let kvpair:boolean = true;

            if (values instanceof Map) this.values = new Map(values);
            else
            {
                kvpair = false;
                this.values = new Map<string,any>();
                values.forEach((val) => this.values.set(val,val));
            }

            list = document.createElement("datalist");
            list.setAttribute("id",name);

            this.values.forEach((val,key) =>
            {
                let option:HTMLOptionElement = document.createElement("option");

                option.text = val;
                if (kvpair) option.value = key;

                list.append(option);
            })

            this.clazz.element.appendChild(list);
        }

        this.clazz.element.setAttribute("list",name);
    }

    private setDropDownValues(xvalues:Set<any>|Map<string,any>) : void
    {
        if (xvalues instanceof Map) this.values = new Map(xvalues);
        else
        {
            this.values = new Map<string,any>();
            xvalues.forEach((val) => this.values.set(val,val));
        }

        this.values.forEach((val,key) =>
        {
            let option:HTMLOptionElement = document.createElement("option");

            option.text = val;
            option.value = key;

            this.clazz.element.appendChild(option);
        });
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
        setTimeout(() => {this.clazz.focus()},0);
        return(true);
    }

    public blur() : void
    {
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
        if (value == null) value = "";
        if (this.clazz != null) this.clazz.value = value;
    }

    public get valid() : boolean
    {
        return(this.valid$);
    }

    public get dirty() : boolean
    {
        return(!this.firstchange);
    }

    public validate() : boolean
    {
        if (this.state == RecordState.qmode)
            return(true);

        if (!this.clazz.validate())
            return(false);

        if (this.mandatory && (this.value == null || (""+this.value).length == 0))
            return(false);

        if (this.enforce && this.values != null && this.value != null)
            if (!this.values.has(this.value)) return(false);

        return(true);
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
        this.readonly$ = true;
        this.state = RecordState.na;

        if (this.clazz != null)
        {
            this.clazz.enable = false;
            this.clazz.readonly = true;
        }
    }

    private setInputState() : void
    {
        this.enabled$ = false;

        if (!this.options$.navigable)
        {
            if (this.clazz != null)
                this.clazz.enable = this.enabled$;

            return;
        }

        if (this.state$ == RecordState.na) this.enabled$ = true;
        else if (this.state$ == RecordState.insert && this.options$.insert) this.enabled$ = true;
        else if (this.state$ == RecordState.update && this.options$.update) this.enabled$ = true;
        else if (this.state$ == RecordState.qmode && this.options$.query) this.enabled$ = true;

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

    public get definition() : FieldDefinition
    {
        return(this.def);
    }

    public set definition(def:FieldDefinition)
    {
        let override:boolean = false;

        if (this.def != null)
        {
            override = true;

            if (def.hasOwnProperty("case"))
                this.def.case = def.case;

            if (def.hasOwnProperty("mandatory"))
                this.def.mandatory = def.mandatory;

            if (def.hasOwnProperty("type"))
                this.def.type = def.type;

            if (def.hasOwnProperty("fieldoptions"))
            {
                if (def.hasOwnProperty("query"))  this.def.fieldoptions.query = def.fieldoptions.query;
                if (def.hasOwnProperty("insert")) this.def.fieldoptions.insert = def.fieldoptions.insert;
                if (def.hasOwnProperty("update")) this.def.fieldoptions.update = def.fieldoptions.update;
                if (def.hasOwnProperty("navigable")) this.def.fieldoptions.navigable = def.fieldoptions.navigable;
            }
        }

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
            if (!this.options$.hasOwnProperty("navigable")) this.options$.navigable = true;
        }

        if (override)
            this.setInputState();
    }


    private setType(type:FieldType) : void
    {
        let seq:number = this.seq;
        this.container.innerHTML = null;
        let cname:any = FieldImplementation.getClass(FieldType[type]);

        if (cname != null)
        {
            this.clazz = new cname();

            this.container.innerHTML = this.clazz.html;
            this.clazz.element = this.container.children[0] as HTMLElement;

            if (this.size$ != null) this.clazz.size = this.size$;
            if (this.value$ != null) this.clazz.value = this.value$;
            if (this.class$ != "") this.clazz.element.classList.add(this.class$);
            if (this.style$ != "") this.clazz.element.style.cssText = this.style$;

            this.seq = seq;

            this.disable();
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
            this.lvalue = this.value;
            this.lvalid = this.valid$;
            this.fgroup$["onEvent"](event,this,"focus");
        }

        if (event.type == "blur")
        {
            if (this.dirty && this.value == this.lvalue && !this.lvalid)
                this.valid = false;

            this.fgroup$["onEvent"](event,this,"blur");
        }

        if (event.type == "click" || event.type == "dblclick")
            this.fgroup$["onEvent"](event,this,event.type);

        if (event.type == "change")
        {
            if (this.enabled && !this.readonly)
                if (!this.valid) this.fgroup$.valid = false;

            this.valid = this.validate();

            if (this.clazz instanceof CheckBox)
                this.value = this.value$;

            if (this.clazz instanceof RadioButton)
                this.value = this.value$;

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

            let map:string = KeyMapper.map(keydef);
            let key:keymap = KeyMapper.keymap(map);

            if (key != null)
            {
                // handled by application
                if
                (
                    key == keymap.listval         ||
                    key == keymap.connect         ||
                    key == keymap.disconnect      ||
                    key == keymap.delete          ||
                    key == keymap.insertafter     ||
                    key == keymap.insertbefore    ||
                    key == keymap.enterquery      ||
                    key == keymap.executequery
                )
                {
                    this.fgroup$.copy(this);
                    return;
                }

                this.fgroup$["onEvent"](event,this,"key",key);
            }
        }

        if (event.type == "keypress" || keypress)
        {
            if (this.readonly) return;

            if (this.firstchange && (event.key.length == 1 || event.keyCode == KeyCodes.backspace))
            {
                this.firstchange = false;
                if (!this.valid) this.fgroup$.valid = true;
                this.fgroup$["onEvent"](event,this,"fchange");
            }

            let value:any = this.value;
            setTimeout(() => {this.continious(event,value);},0);
        }
    }


    private continious(event:any, value:any) : void
    {
        if (this.value == value)
            return;

        if (this.def.type == FieldType.integer)
        {
            if (!this.valnumber(value))
                return;
        }

        if (this.def.type == FieldType.decimal)
        {
            if (!this.valdecimal(value))
                return;
        }

        if (this.value != null && this.def.case == Case.lower)
            this.value = (""+this.value).toLowerCase();

        if (this.value != null && this.def.case == Case.upper)
            this.value = (""+this.value).toUpperCase();

        this.fgroup$.onEvent(event,this,"cchange");
    }


    private valnumber(value:string) : boolean
    {
        if (this.state == RecordState.qmode)
            return(true);

        let nvalue:string = this.value;

        if (nvalue == null || nvalue.trim().length == 0)
            return(true);

        let numeric:boolean = !isNaN(+nvalue);

        if (!numeric || nvalue.indexOf(".") >= 0)
        {
            this.value = value;
            return(false);
        }

        return(true);
    }


    private valdecimal(value:string) : boolean
    {
        if (this.state == RecordState.qmode)
            return(true);

        let nvalue:string = this.value;

        if (nvalue == null || nvalue.trim().length == 0)
            return(true);

        let numeric:boolean = !isNaN(+nvalue);

        if (!numeric)
        {
            this.value = value;
            return(false);
        }

        return(true);
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
        impl.addEventListener("click", (event) => {this.onEvent(event)});
        impl.addEventListener("keydown", (event) => {this.onEvent(event)});
        impl.addEventListener("keypress", (event) => {this.onEvent(event)});
        impl.addEventListener("dblclick", (event) => {this.onEvent(event)});
    }
}