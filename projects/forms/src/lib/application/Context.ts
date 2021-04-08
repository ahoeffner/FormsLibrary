import { Config } from "./Config";
import { Injectable } from "@angular/core";
import { Application } from "./Application";


@Injectable({
    providedIn: 'root',
})


export class Context
{
    public conf:Config;
    public app:Application;
}