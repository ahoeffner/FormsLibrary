import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { BlockBase } from "../blocks/BlockBase";
import { Container} from "../container/Container";
import { PopupWindow } from "../popup/PopupWindow";
import { FieldInstance } from "../input/FieldInstance";
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


export class LoginForm extends BlockBase implements Popup, OnInit, AfterViewInit
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
    }

    private init() : void
    {
        let actions:string[] = [];
        actions.push(this.app.keymap.enter);
        actions.push(this.app.keymap.escape);
        this.addListener({types: "key", keys: actions, listener: this.onEvent});
    }

    public setWin(win:PopupWindow): void
    {
        this.win = win;
    }

    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
        this.init();
    }

    public close(cancel:boolean) : void
    {
        this.win.closeWindow();
    }

    public onEvent(field:FieldInstance,type:string,key:string) : void
    {
        console.log("event, field: "+field.name+" type: "+type+" key: "+key);
    }

    public ngOnInit(): void
    {
        this.app.setContainer();
    }

    public ngAfterViewInit(): void
    {
        let container:Container = this.app.getContainer();
        container.finish();

        container.getBlock("").getRecords().forEach((rec) =>
        {this.addRecord(new Record(0,rec.fields,rec.index));});

        this.usr = this.getField(0,"usr");
        this.pwd = this.getField(0,"pwd");

        this.usr.setType("input");
        this.pwd.setType("password");

        this.usr.enable(true);
        this.pwd.enable(true);

        this.app.dropContainer();
    }
}