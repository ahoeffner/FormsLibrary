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
        let cname:any = FieldTypes.getClass(type);

        this.clazz = new cname();
        this.field.innerHTML = this.clazz.html;
    }


    public ngAfterViewInit(): void
    {
		this.field = this.fieldelem?.nativeElement as HTMLDivElement;
        this.app.getContainer().register(this);
    }
}