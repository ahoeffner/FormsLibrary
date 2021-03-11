import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { BlockBase } from "../blocks/BlockBase";
import { PopupWindow } from "../popup/PopupWindow";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Container, ContainerBlock, ContainerRecord } from "../container/Container";


@Component({
    selector: '',
    template:
    `
        <table style='margin-top: 20px'>
          <tr>
            <td>Username</td><td>: <field row='0' name='usr'></field> </td>
          </tr>
          <tr>
            <td>Password</td><td>: <field row='0' name='pwd'></field> </td>
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

    public ngOnInit(): void
    {
        this.app.setContainer();
    }

    public ngAfterViewInit(): void
    {
        let container:Container = this.app.getContainer();

        let block:ContainerBlock = container.getBlock("");
        this.fields = block.getFields();

        let crec:ContainerRecord = block.getRecord(0);
        this.addRecord(new Record(0,crec.fields,crec.index));

        this.usr = this.getField(0,"usr");
        this.pwd = this.getField(0,"pwd");

        this.usr.setFieldType("input");
        this.pwd.setFieldType("password");

        this.usr.enable(true);
        this.pwd.enable(true);

        this.app.dropContainer();
    }
}