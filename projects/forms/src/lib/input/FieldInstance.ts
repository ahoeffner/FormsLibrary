import { Field } from './Field';
import { Key, KeyMapper } from '../keymap/KeyMap';
import { FieldTypes, FieldType } from './FieldType';
import { Application } from "../application/Application";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #field></span>'
})


export class FieldInstance implements AfterViewInit
{
    private value$:any;
    private type$:string;
    private clazz:FieldType;
    private app:ApplicationImpl;
    private field:HTMLSpanElement;
    private upper:boolean = false;
    private lower:boolean = false;
    private firstchange:boolean = true;

    public guid:number;
    public group:Field = null;

    @Input("id")    private id$:string = "";
    @Input("row")   private row$:number = -2;
    @Input("name")  private name$:string = "";
    @Input("block") private block$:string = "";

    @ViewChild("field", {read: ElementRef}) private fieldelem: ElementRef;


    constructor(app:Application)
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

    public get name() : string
    {
        return(this.name$);
    }

    public get type() : string
    {
        return(this.type$);
    }

    public get block() : string
    {
        return(this.block$);
    }

    public get value() : any
    {
        return(this.clazz.getValue());
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
        this.clazz.setValue(value);
    }


    public enable(flag:boolean) : void
    {
        this.clazz.enable(flag);
    }


    public set type(type:string)
    {
        this.type$ = type;
        this.field.innerHTML = null;
        let cname:any = FieldTypes.getClass(type);

        if (cname != null)
        {
            this.clazz = new cname();
            this.field.innerHTML = this.clazz.html;
            this.clazz.element = this.field.children[0] as HTMLElement;
            this.addTriggers();
        }
    }


    public onEvent(event:any)
    {
        if (this.group == null)
            return;

        event.preventDefault();

        if (event.type == "focus")
        {
            this.firstchange = true;
            this.value$ = this.clazz.getValue();
            this.group["onEvent"](this,"focus");
        }

        if (event.type == "blur")
            this.group["onEvent"](this,"blur");

        if (event.type == "keyup")
        {
            if (+event.keyCode < 16 || +event.keyCode > 20)
            {
                let current:any = this.clazz.getValue();

                if (this.value$ == current)
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
                    this.group["onEvent"](this,"key",key);
                }
                else
                {
                    this.value$ = current;

                    if (this.lower)
                    {
                        this.value$ = (""+this.value$).toLowerCase();
                        this.clazz.setValue(this.value$);
                    }

                    if (this.upper)
                    {
                        this.value$ = (""+this.value$).toUpperCase();
                        this.clazz.setValue(this.value$);
                    }

                    if (this.firstchange)
                    {
                        this.firstchange = false;
                        this.group["onEvent"](this,"fchange");
                    }

                    this.group["onEvent"](this,"ichange");
                }
            }
        }
    }


    public ngAfterViewInit(): void
    {
		this.field = this.fieldelem?.nativeElement as HTMLDivElement;

        this.id$ = this.id$.toLowerCase();
        this.name$ = this.name$.toLowerCase();
        this.block$ = this.block$.toLowerCase();

        this.app.getContainer().register(this);
    }


    private addTriggers() : void
    {
        let impl:Node = this.field.firstChild;

        if (impl == null) return;
        impl.addEventListener("blur", (event) => {this.onEvent(event)});
        impl.addEventListener("focus", (event) => {this.onEvent(event)});
        impl.addEventListener("keyup", (event) => {this.onEvent(event)});
        impl.addEventListener("change", (event) => {this.onEvent(event)});
        impl.addEventListener("onclick", (event) => {this.onEvent(event)});
        impl.addEventListener("ondblclick", (event) => {this.onEvent(event)});
    }
}