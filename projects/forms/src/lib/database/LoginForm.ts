import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { KeyMap } from "../keymap/KeyMap";
import { Config } from "../application/Config";
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
        this.init();
    }

    private init() : void
    {
        let actions:string[] = [];
        actions.push(this.keymap.enter);
        actions.push(this.keymap.escape);
        this.addListener(this.onEvent,"key",actions);
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
        this.win.closeWindow();
    }

    public onEvent(field:FieldInstance,type:string,key:string) : void
    {
        if (key == this.keymap.enter) this.close(false);
        else if (key == this.keymap.escape) this.close(true);
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
        {this["base"].addRecord(new Record(0,rec.fields,rec.index));});

        this.usr = this["base"].getField(0,"usr");
        this.pwd = this["base"].getField(0,"pwd");

        this.usr.setType("input");
        this.pwd.setType("password");

        this.usr.enable(true);
        this.pwd.enable(true);

        this.usr.focus();
        this.app.dropContainer();
    }
}