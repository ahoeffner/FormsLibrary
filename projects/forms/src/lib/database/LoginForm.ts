import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Block } from "../blocks/Block";
import { keymap } from "../keymap/KeyMap";
import { Container} from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { Record, RecordState } from "../blocks/Record";
import { KeyTriggerEvent } from "../events/TriggerEvent";
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


export class LoginForm extends Block implements Popup, OnInit, AfterViewInit
{
    private usr:Field;
    private pwd:Field;
    private win:PopupWindow;
    private app:ApplicationImpl;

    public top:string    = "20%";
    public left:string   = "25%";
    public width:string  = "300px";
    public height:string = "150px";
    public title:string  = "Login";

    constructor()
    {
        super();

        this.addKeyListener(this.onEvent,
        [
            keymap.enter,
            keymap.escape,
            keymap.nextfield,
            keymap.prevfield
        ]);
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

    public async onEvent(kevent:KeyTriggerEvent) : Promise<boolean>
    {
        if (kevent.code == keymap.enter) this.close(false);
        if (kevent.code == keymap.escape) this.close(true);

        if (kevent.code == keymap.nextfield && kevent.field == "pwd")
        {
            kevent.jsevent.preventDefault();
            this.usr.focus();
        }

        if (kevent.code == keymap.prevfield && kevent.field == "usr")
        {
            kevent.jsevent.preventDefault();
            this.pwd.focus();
        }

        return(true);
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