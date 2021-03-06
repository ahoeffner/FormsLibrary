import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Block } from "../blocks/Block";
import { keymap } from "../keymap/KeyMap";
import { Record } from "../blocks/Record";
import { FieldType } from "../input/FieldType";
import { Context } from "../application/Context";
import { Container} from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { KeyTriggerEvent } from "../events/TriggerEvent";
import { FieldDefinition } from "../input/FieldDefinition";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, OnInit } from "@angular/core";


@Component({
    selector: '',
    template:
    `
        <table style='margin-top: "20px"; margin-right: "10px"'>
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
    public tmargin:string = "20px";
    public title:string  = "Login";

    constructor(ctx:Context)
    {
        super();

        this.app = ctx.app["_impl_"];

        this.addKeyTrigger(this.onEvent,
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

    public close(cancel:boolean) : void
    {
        this.app.enable();
        this.win.closeWindow();
        if (!cancel) this.app.appstate.connection.connect(this.usr.value,this.pwd.value);
        this.app.getCurrentForm()?.focus();
    }

    public async onEvent(kevent:KeyTriggerEvent) : Promise<boolean>
    {
        if (kevent.key == keymap.enter) this.close(false);
        if (kevent.key == keymap.escape) this.close(true);

        if (kevent.key == keymap.nextfield && kevent.field == "usr")
        {
            kevent.event.preventDefault();
            this.pwd.focus();
        }

        if (kevent.key == keymap.nextfield && kevent.field == "pwd")
        {
            kevent.event.preventDefault();
            this.usr.focus();
        }

        if (kevent.key == keymap.prevfield && kevent.field == "usr")
        {
            kevent.event.preventDefault();
            this.pwd.focus();
        }

        if (kevent.key == keymap.prevfield && kevent.field == "pwd")
        {
            kevent.event.preventDefault();
            this.usr.focus();
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

        let usr:FieldDefinition = {name: "usr", mandatory: true, type: FieldType.text};
        let pwd:FieldDefinition = {name: "pwd", mandatory: true, type: FieldType.password};

        this.usr.setDefinition(usr,true);
        this.pwd.setDefinition(pwd,true);

        this.usr.enable(false);
        this.pwd.enable(false);

        let field:HTMLInputElement = document.getElementsByName("usr")[1] as HTMLInputElement;

        let width:string = (1.75*field.offsetWidth+10)+"px";
        let height:string = (6*field.offsetHeight+20)+"px";

        this.win.resize(width,height);

        this.usr.focus();
        this.app.dropContainer();
    }
}