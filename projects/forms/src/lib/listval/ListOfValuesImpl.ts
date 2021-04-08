import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { ListOfValues } from "./ListOfValues";
import { FieldType } from "../input/FieldType";
import { BlockImpl } from "../blocks/BlockImpl";
import { Context } from "../application/Context";
import { Container } from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { PopupInstance } from "../popup/PopupInstance";
import { FieldDefinition } from "../input/FieldDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { OnInit, AfterViewInit, Component } from "@angular/core";


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

            <tr *ngFor="let item of [].constructor(15); let row = index">
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
    private search:Field;
    private description:Field;

    private win:PopupWindow;
    private impl:BlockImpl[];
    private app:ApplicationImpl;

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
        this.title = lov.title;
        this.width = lov.width;
        this.height = lov.height;
        this.height = "500px";

        this.win.title = this.title;
        this.win.width = this.width;
        this.win.height = this.height;
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

        container.getBlock("search").records.forEach((rec) =>
        {
            this.impl[0].addRecord(new Record(rec.row,rec.fields,rec.index));

            this.search = this.impl[0].getField(rec.row,"filter");
            let search:FieldDefinition = {name: "filter", type: FieldType.text};

            this.search.definition = search;
            this.search.enable(false);

        })

        container.getBlock("result").records.forEach((rec) =>
        {
            this.impl[1].addRecord(new Record(rec.row,rec.fields,rec.index));

            this.description = this.impl[1].getField(rec.row,"description");
            let description:FieldDefinition = {name: "description", type: FieldType.text};

            this.description.definition = description;
            this.description.enable(true);
        });

        this.app.dropContainer();
    }
}