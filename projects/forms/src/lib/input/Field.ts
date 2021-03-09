import { Key } from './Key';
import { FieldGroup } from './FieldGroup';
import { FieldTypes, FieldType } from './FieldType';
import { Application } from "../application/Application";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
    selector: 'field',
    template: '<span #field></span>'
})


export class Field implements AfterViewInit
{
    private value$:any;
    private type$:string;
    private clazz:FieldType;
    private app:ApplicationImpl;
    private field:HTMLSpanElement;

    public row:number = 0;
    public group:FieldGroup = null;

    @Input("id")    private id$:string = "";
    @Input("row")   private rown:string = "";
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
            this.clazz.element = this.field;
            this.field.innerHTML = this.clazz.html;
            this.addTriggers();
        }
    }


    public onEvent(event:any)
    {
        //if (this.group == null)
            //return;

        if (event.type == "focus")
            this.value$ = this.clazz.getValue();

        if (event.type == "keyup")
        {
            if (+event.keyCode < 16 || +event.keyCode > 20)
            {
                let key:Key = new Key();
                key.code    = event.keyCode;
                key.alt     = event.altKey;
                key.ctrl    = event.ctrlKey;
                key.meta    = event.metaKey;
                key.shift   = event.shiftKey;

                console.log(this.value$+" == "+this.clazz.getValue());
            }
        }
    }


    public ngAfterViewInit(): void
    {
		this.field = this.fieldelem?.nativeElement as HTMLDivElement;

        if (this.rown == "") this.rown = "-2";
        else if (this.rown == "first")   this.rown = "-1";
        else if (this.rown == "current") this.rown = "-2";
        else if (this.rown == "last")    this.rown = "-3";

        this.row = +this.rown;
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