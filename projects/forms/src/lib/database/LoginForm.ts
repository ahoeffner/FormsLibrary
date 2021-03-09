import { Popup } from "../popup/Popup";
import { FieldGroup } from "../input/FieldGroup";
import { PopupWindow } from "../popup/PopupWindow";
import { Container, Record } from "../container/Container";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, OnInit } from "@angular/core";


@Component({
    selector: '',
    template:
    `
        <table style='margin-top: 20px'>
          <tr>
            <td>Username</td><td>: <field style='width: 100px' name='usr'></field> </td>
          </tr>
          <tr>
            <td>Password</td><td>: <field style='width: 200px' name='pwd'></field> </td>
          </tr>
        </table>
    `
})


export class LoginForm implements Popup, OnInit, AfterViewInit
{
    private usr:FieldGroup;
    private pwd:FieldGroup;
    private win:PopupWindow;
    private app:ApplicationImpl;

    public top:string    = "20%";
    public left:string   = "25%";
    public width:string  = "300px";
    public height:string = "150px";
    public title:string  = "Login";

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
    }

    public ngOnInit(): void
    {
        this.app.setContainer();
    }

    public ngAfterViewInit(): void
    {
        let container:Container = this.app.getContainer();
        let record:Record = container.getRecord(0);

        this.usr = record.getField("usr");
        this.pwd = record.getFields()[1];

        this.usr.setFieldType("input");
        this.pwd.setFieldType("password");

        this.usr.enable(true);
        this.pwd.enable(true);

        this.app.dropContainer();
    }
}