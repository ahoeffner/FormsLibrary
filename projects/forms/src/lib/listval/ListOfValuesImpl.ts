import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { Table } from "../database/Table";
import { Trigger } from "../events/Triggers";
import { ListOfValues } from "./ListOfValues";
import { FieldType } from "../input/FieldType";
import { BlockImpl } from "../blocks/BlockImpl";
import { FieldData } from "../blocks/FieldData";
import { Context } from "../application/Context";
import { Statement } from "../database/Statement";
import { PopupWindow } from "../popup/PopupWindow";
import { Container } from "../container/Container";
import { Connection } from "../database/Connection";
import { PopupInstance } from "../popup/PopupInstance";
import { FieldDefinition } from "../input/FieldDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { OnInit, AfterViewInit, Component } from "@angular/core";
import { FieldTriggerEvent, SQLTriggerEvent } from "../events/TriggerEvent";


@Component({
    selector: '',
    template:
    `
        <div class="lov">
        <table>
            <tr>
                <td><field size="20" name="filter" block="search"></field></td>
            </tr>

            <tr class="spacer"></tr>

            <tr *ngFor="let item of [].constructor(rows); let row = index">
                <td><field size="20" name="description" row="{{row}}" block="result"></field></td>
            </tr>

            <tr class="spacer"></tr>
        </table>
        </div>
    `,
    styles:
    [
    `
        .spacer
        {
            height: 8px;
        }
    `
    ]
})


export class ListOfValuesImpl implements Popup, OnInit, AfterViewInit
{
    private fetch:number;
    private filter:Field;
    private description:Field;
    private lov:ListOfValues;
    private prefix:string = "";
    private postfix:string = "";

    private win:PopupWindow;
    private impl:BlockImpl[];
    private app:ApplicationImpl;

    public rows:    number = 10;
    public top:     string = null;
    public left:    string = null;
    public width:   string = null;
    public height:  string = null;
    public title:   string = null;


    public static show(app:ApplicationImpl, impl:BlockImpl[], lov:ListOfValues)
    {
        let pinst:PopupInstance = new PopupInstance();
        pinst.display(app,ListOfValuesImpl);

        let lovwin:ListOfValuesImpl = pinst.popup() as ListOfValuesImpl;

        lovwin.setDefinition(lov);
        lovwin.setBlockImpl(impl);
    }


    constructor(ctx:Context)
    {
        this.app = ctx.app["_impl_"];
    }


    public setDefinition(lov:ListOfValues) : void
    {
        this.lov = lov;
        this.title = lov.title;
        this.width = lov.width;
        this.height = lov.height;
        this.height = "200px";

        this.win.title = this.title;
        this.win.width = this.width;
        this.win.height = this.height;

        this.rows = lov.rows ? lov.rows : 10;
        this.fetch = lov.rows ? 2 * lov.rows : 10;
    }


    public setBlockImpl(impl:BlockImpl[]) : void
    {
        this.impl = impl;
    }


    public close(cancel: boolean): void
    {
        this.app.enable();
        this.win.closeWindow();
        this.app.getCurrentForm()?.focus();
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngOnInit(): void
    {
        this.app.disable();
        this.app.setContainer();
    }


    public ngAfterViewInit(): void
    {
        let container:Container = this.app.getContainer();
        container.finish();

        this.impl[0].fields = container.getBlock("search").fields;
        this.impl[1].fields = container.getBlock("result").fields;

        container.getBlock("search").records.forEach((rec) =>
        {
            this.impl[0].addRecord(new Record(rec.row,rec.fields,rec.index));

            this.filter = this.impl[0].getField(rec.row,"filter");
            let filter:FieldDefinition = {name: "filter", type: FieldType.text};

            if (this.lov.case != null) filter.case = this.lov.case;
            this.filter.definition = filter;
            this.filter.enable(false);

        })

        let def:FieldDefinition = {name: "description", type: FieldType.text, fieldoptions: {navigable: false, insert: false, update: false,  query:false}};

        container.getBlock("result").records.forEach((rec) =>
        {
            this.impl[1].addRecord(new Record(rec.row,rec.fields,rec.index));
            this.description = this.impl[1].getField(rec.row,"description");

            this.description.definition = def;
            this.description.enable(true);
        });

        let conn:Connection = this.app.appstate.connection;
        conn.connect("demo","Manager1");

        let table:Table = new Table(conn,{name: "none"},null,[],null,this.fetch);

        this.impl[1].setApplication(this.app);
        this.impl[1].data = new FieldData(this.impl[1],table,["description"]);

        this.app.dropContainer();

        if (this.lov.prefix != null) this.prefix = this.lov.prefix;
        if (this.lov.postfix != null) this.prefix = this.lov.postfix;

        this.impl[0].addTrigger(this,this.search,Trigger.Typing);
        this.impl[1].addTrigger(this,this.prequery,Trigger.PreQuery);

        this.filter.focus();
    }


    private async search(trigger:FieldTriggerEvent) : Promise<boolean>
    {
        setTimeout(() => {this.impl[1].executeqry();},200);
        return(true);
    }


    private async prequery(trigger:SQLTriggerEvent) : Promise<boolean>
    {
        let stmt:Statement = new Statement(this.lov.sql);

        stmt.cursor = trigger.stmt.cursor;

        if (this.lov.bindvalues != null)
            this.lov.bindvalues.forEach((bv) => {stmt.bind(bv.name,bv.value,bv.type)});

        console.log("filter: "+this.prefix+this.filter.value+this.postfix)
        stmt.bind("filter",this.prefix+this.filter.value+this.postfix);

        trigger.stmt = stmt;
        return(true);
    }
}