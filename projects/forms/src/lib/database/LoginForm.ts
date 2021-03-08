import { Popup } from "../popup/Popup";
import { Field } from "../input/Field";
import { Container } from "../container/Container";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PopupWindow } from "../popup/PopupWindow";


@Component({
    selector: '',
    template:
    `
        <table style='margin-top: 20px'>
          <tr>
            <td>username:</td><td><field style='width: 100px' name='usr'></field> </td>
          </tr>
          <tr>
            <td>password:</td><td><field style='width: 200px' name='pwd'></field> </td>
          </tr>
        </table>
    `
})


export class LoginForm implements Popup, OnInit, AfterViewInit
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

        this.usr = container.components[0];
        this.pwd = container.components[1];

        this.usr.type = "input";
        this.pwd.type = "password";

        this.app.dropContainer();
    }
}