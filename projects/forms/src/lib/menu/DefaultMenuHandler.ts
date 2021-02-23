import { Form } from "../forms/Form";
import { MenuHandler } from './MenuHandler';


export class DefaultMenuHandler extends MenuHandler
{
    public form:Form;

    public onInit() : void
    {
        this.init();
    }

    public onConnect(): void
    {
        console.log("onConnect");
    }

    public onDisconnect(): void
    {
        console.log("onDisconnect");
    }

    public onFormChange(form: Form): void
    {
        this.form = form;
        if (this.ready) this.init();
    }

    private init() : void
    {
        if (this.form == null)
        {
            this.disable();
            this.enable("/connection");
        }
        else
        {
            this.enable();
        }
    }

    public connect() : void
    {
        this.app.connect();
    }

    public disconnect() : void
    {
        this.disable();
    }

    public close() : void
    {
        this.form.close(false);
        this.enable("/connection");
    }
}