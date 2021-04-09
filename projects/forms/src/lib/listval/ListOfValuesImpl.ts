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
                <th><field size="10" name="filter" block="search"></field></th>
            </tr>

            <tr class="spacer"></tr>

            <tr *ngFor="let item of [].constructor(rows); let row = index">
                <td><field size="{{size}}" name="description" row="{{row}}" block="result"></field></td>
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

    private last:string = "";
    private minlen:number = 0;
    private prefix:string = "";
    private postfix:string = "";
    private wait:boolean = false;

    private win:PopupWindow;
    private iblock:BlockImpl;
    private sblock:BlockImpl;
    private rblock:BlockImpl;
    private app:ApplicationImpl;

    public rows:    number = 10;
    public size:    number = 20;
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

        if (this.size == null) this.size = 20;
        if (this.width == null) this.width = "200px";
        if (this.height == null) this.height = "250px";

        this.win.title = this.title;
        this.win.width = this.width;
        this.win.height = this.height;

        this.rows = lov.rows ? lov.rows : 15;
        this.fetch = lov.rows ? lov.rows : 15;

        if (this.lov.minlen != null) this.minlen = this.lov.minlen;
        if (this.lov.prefix != null) this.prefix = this.lov.prefix;
        if (this.lov.postfix != null) this.postfix = this.lov.postfix;
    }


    public setBlockImpl(impl:BlockImpl[]) : void
    {
        this.sblock = impl[0];
        this.rblock = impl[1];
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

        this.sblock.fields = container.getBlock("search").fields;
        this.rblock.fields = container.getBlock("result").fields;

        container.getBlock("search").records.forEach((rec) =>
        {
            this.sblock.addRecord(new Record(rec.row,rec.fields,rec.index));

            this.filter = this.sblock.getField(rec.row,"filter");
            let filter:FieldDefinition = {name: "filter", type: FieldType.text};

            if (this.lov.case != null) filter.case = this.lov.case;
            this.filter.definition = filter;
            this.filter.enable(false);

        })

        let def:FieldDefinition = {name: "description", type: FieldType.text, fieldoptions: {navigable: false, insert: false, update: false,  query:false}};

        container.getBlock("result").records.forEach((rec) =>
        {
            this.rblock.addRecord(new Record(rec.row,rec.fields,rec.index));
            this.description = this.rblock.getField(rec.row,"description");

            this.description.definition = def;
            this.description.enable(true);
        });

        let conn:Connection = this.app.appstate.connection;
        conn.connect("demo","Manager1");

        let table:Table = new Table(conn,{name: "none"},null,[],null,this.fetch);

        this.rblock.setApplication(this.app);
        this.rblock.data = new FieldData(this.rblock,table,["description"]);

        this.app.dropContainer();

        this.sblock.addTrigger(this,this.search,Trigger.Typing);
        this.rblock.addTrigger(this,this.prequery,Trigger.PreQuery);

        this.filter.focus();
    }


    private async search(trigger:FieldTriggerEvent) : Promise<boolean>
    {
        this.execute();
        return(true);
    }


    private async execute() : Promise<void>
    {
        if (this.wait)
        {
            setTimeout(() => {this.execute();},200);
            return;
        }

        if (this.filter.value == this.last)
            return;

        this.wait = true;
        this.last = this.filter.value;

        if (this.last.length < this.minlen) this.rblock.clear();
        else                                await this.rblock.executeqry();

        this.wait = false;
    }


    private async prequery(trigger:SQLTriggerEvent) : Promise<boolean>
    {
        let stmt:Statement = new Statement(this.lov.sql);

        stmt.cursor = trigger.stmt.cursor;

        if (this.lov.bindvalues != null)
            this.lov.bindvalues.forEach((bv) => {stmt.bind(bv.name,bv.value,bv.type)});

        stmt.bind("filter",this.prefix+this.filter.value+this.postfix);

        trigger.stmt = stmt;
        return(true);
    }
}