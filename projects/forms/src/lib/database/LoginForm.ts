import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Block } from "../blocks/Block";
import { Record, RecordState } from "../blocks/Record";
import { KeyMap } from "../keymap/KeyMap";
import { Config } from "../application/Config";
import { Container} from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { FieldInstance } from "../input/FieldInstance";
import { EventListener } from "../events/EventListener";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, OnInit } from "@angular/core";


@Component({
    selector: '',
    template:
    `
        <table style='margin-top: 20px'>
          <tr>
            <td>Username</td><td>: <field name='usr'></field> </td>
          </tr>
          <tr>
            <td>Password</td><td>: <field name='pwd'></field> </td>
          </tr>
        </table>
    `
})


export class LoginForm extends Block implements Popup, OnInit, AfterViewInit, EventListener
{
    private usr:Field;
    private pwd:Field;
    private keymap:KeyMap;
    private win:PopupWindow;
    private app:ApplicationImpl;

    public top:string    = "20%";
    public left:string   = "25%";
    public width:string  = "300px";
    public height:string = "150px";
    public title:string  = "Login";

    constructor(conf:Config)
    {
        super();
        this.keymap = conf.keymap;
        this["_impl_"].config = conf;
        this["_impl_"].parent = this;
    }

    public setWin(win:PopupWindow): void
    {
        this.win = win;
    }

    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
    }

    public close(cancel:boolean) : void
    {
        this.app.enable();
        this.win.closeWindow();
        if (!cancel) this.app.appstate.connection.connect(this.usr.value,this.pwd.value);
        this.app.getCurrentForm()?.focus();
    }

    public async onEvent(event:any, field:FieldInstance,_type:string,key:string)
    {
        if (key == this.keymap.enter) this.close(false);
        if (key == this.keymap.escape) this.close(true);

        if (key == this.keymap.nextfield && field.name == "pwd")
        {
            event.preventDefault();
            this.usr.focus();
        }

        if (key == this.keymap.prevfield && field.name == "usr")
        {
            event.preventDefault();
            this.pwd.focus();
        }
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

        container.getBlock("").records.forEach((rec) =>
        {this["_impl_"].addRecord(new Record(0,rec.fields,rec.index));});

        this.usr = this["_impl_"].getField(0,"usr");
        this.pwd = this["_impl_"].getField(0,"pwd");

        this.usr.setType("input");
        this.pwd.setType("password");

        this.usr.enable(RecordState.na,false);
        this.pwd.enable(RecordState.na,false);

        this.usr.focus();
        this.app.dropContainer();
    }
}