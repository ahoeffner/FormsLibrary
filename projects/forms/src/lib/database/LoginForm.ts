import { Popup } from "../popup/Popup";
import { Component } from "@angular/core";


@Component({
    template: 'Login'
})


export class LoginForm implements Popup
{
    public title:string = "Login";


    public close(cancel:boolean) : void
    {
    }
}