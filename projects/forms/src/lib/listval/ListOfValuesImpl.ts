import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { keymap } from "../keymap/KeyMap";
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
import { FieldTriggerEvent, KeyTriggerEvent, SQLTriggerEvent } from "../events/TriggerEvent";


@Component({
    selector: '',
    template:
    `
        <div class="lov">
        <table>
            <tr>
                <td class="lov-center"><field class="lov-search" size="15" name="filter" block="search"></field></td>
            </tr>

            <tr class="lov-spacer"></tr>

            <tr *ngFor="let item of [].constructor(rows); let row = index">
                <td><field class="lov-result" size="{{size}}" name="description" row="{{row}}" block="result"></field></td>
            </tr>

            <tr class="lov-spacer"></tr>
        </table>
        </div>
    `,
    styles:[
        `
            .lov-spacer
            {
                height: 8px;
            }

            .lov-center
            {
                border: none;
                display: flex;
                justify-content: center;
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

        this.rows = lov.rows ? lov.rows : 12;
        this.fetch = lov.rows ? lov.rows : 12;

        if (this.size == null) this.size = 25;

        let width:number = this.size*10;
        let height:number = this.rows*28+10;

        if (this.width == null) this.width = width+"px";
        if (this.height == null) this.height = height+"px";

        this.win.title = this.title;
        this.win.width = this.width;
        this.win.height = this.height;

        if (this.lov.minlen != null) this.minlen = this.lov.minlen;
        if (this.lov.prefix != null) this.prefix = this.lov.prefix;
        if (this.lov.postfix != null) this.postfix = this.lov.postfix;
    }


    public setBlockImpl(impl:BlockImpl[]) : void
    {
        this.iblock = impl[0];
        this.sblock = impl[1];
        this.rblock = impl[2];
    }


    public close(_cancel: boolean): void
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

        this.sblock.setFields(container.getBlock("search").fields);
        this.rblock.setFields(container.getBlock("result").fields);

        container.getBlock("search").records.forEach((rec) =>
        {
            this.sblock.addRecord(new Record(rec.row,rec.fields,rec.index));

            this.filter = this.sblock.getField(rec.row,"filter");
            let filter:FieldDefinition = {name: "filter", type: FieldType.text};

            if (this.lov.case != null) filter.case = this.lov.case;
            this.filter.definition = filter;
            this.filter.enable(false);

        })

        let def:FieldDefinition = {name: "description", type: FieldType.text, fieldoptions: {update: false}};

        container.getBlock("result").records.forEach((rec) =>
        {
            this.rblock.addRecord(new Record(rec.row,rec.fields,rec.index));
            this.description = this.rblock.getField(rec.row,"description");

            this.description.definition = def;
            this.description.enable(true);
        });

        let conn:Connection = this.app.appstate.connection;
        let table:Table = new Table(conn,{name: "none"},null,[],null,this.fetch);

        this.rblock.setApplication(this.app);
        this.rblock.data = new FieldData(this.rblock,table,["description"]);

        this.app.dropContainer();

        let keys:keymap[] =
        [
            keymap.enter,
            keymap.escape,
            keymap.nextrecord,
            keymap.prevrecord,
            keymap.nextfield,
            keymap.prevfield
        ];

        this.sblock.addKeyTrigger(this,this.onkey,keys);
        this.rblock.addKeyTrigger(this,this.onkey,keys);

        this.sblock.addTrigger(this,this.search,Trigger.Typing);
        this.rblock.addTrigger(this,this.prequery,Trigger.PreQuery);
        this.rblock.addTrigger(this,this.onMouse,Trigger.MouseDoubleClick);

        this.rblock.navigable = false;
        this.filter.focus();
    }


    private async search(event:FieldTriggerEvent) : Promise<boolean>
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


    private async prequery(event:SQLTriggerEvent) : Promise<boolean>
    {
        let stmt:Statement = new Statement(this.lov.sql);

        stmt.cursor = event.stmt.cursor;

        if (this.lov.bindvalues != null)
            this.lov.bindvalues.forEach((bv) => {stmt.bind(bv.name,bv.value,bv.type)});

        stmt.bind("filter",this.prefix+this.filter.value+this.postfix);

        event.stmt = stmt;
        return(true);
    }


    public async onMouse(event:FieldTriggerEvent) : Promise<boolean>
    {
        this.picked(event.record);
        return(true);
    }


    public async onkey(event:KeyTriggerEvent) : Promise<boolean>
    {
        if (event.type == "key" && event.field == "filter")
        {
            if (event.key == keymap.prevfield)
                event.event.preventDefault();

            if (event.key == keymap.nextfield || event.key == keymap.nextrecord)
            {
                this.rblock.navigable = true;
                this.rblock.focus(0);
            }
        }

        if (event.type == "key" && event.field == "description")
        {
            if (event.key == keymap.nextfield || event.key == keymap.prevfield)
            {
                this.sblock.focus();
                event.event.preventDefault();
                this.rblock.navigable = false;
            }
        }

        if (event.type == "key" && event.key == keymap.escape)
            this.close(false);

        if (event.type == "key" && event.key == keymap.enter)
        {
            let record:number = -1;

            if (event.field == "filter" && this.rblock.fetched == 1)
                record = 0;

            if (event.field == "description")
                record = event.record;

            if (record >= 0) this.picked(record);
        }

        return(true);
    }


    private picked(record:number) : void
    {
        console.log("chose "+this.rblock.getValue(record,"description"));
        console.log("fields: "+this.rblock.fields);
        console.log("columns: "+this.rblock.columns);
        this.close(false);
    }
}