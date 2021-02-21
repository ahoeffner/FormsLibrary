import { Preferences } from "../Preferences";
import { Application } from "./Application";

export class Root
{
    public preferences:Preferences;

    constructor(private app:Application)
    {
        this.preferences = app.preferences;
    }

    public close() : void
    {
        this.app.close();
    }
}