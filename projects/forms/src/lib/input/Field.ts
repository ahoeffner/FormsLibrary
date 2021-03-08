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
    private type$:string;
    private clazz:FieldType;
    private app:ApplicationImpl;
    private field:HTMLSpanElement;

    @Input("name")  public name:string = "";
    @Input("block") public block:string = "";
    @Input("style") public style:string = "";

    @ViewChild("field", {read: ElementRef}) private fieldelem: ElementRef;


    constructor(app:Application)
    {
        this.app = app["impl"];
    }


    public get type() : string
    {
        return(this.type$);
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
            this.addTriggers();
        }
    }


    public onEvent(event:any)
    {
        //console.log(this.name+" type: "+event.type);

        if (event.type == "keyup")
        {
            console.log("key "+event.keyCode);
            console.log("alt: "+event.altKey);
            console.log("ctrl: "+event.ctrlKey);
            console.log("meta: "+event.metaKey);
            console.log("shift: "+event.shiftKey);
        }
    }


    public ngAfterViewInit(): void
    {
		this.field = this.fieldelem?.nativeElement as HTMLDivElement;
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