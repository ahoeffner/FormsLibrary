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
        this.init();
    }

    public onDisconnect(): void
    {
        this.init();
    }

    public onFormChange(form: Form): void
    {
        this.form = form;
        if (this.ready) this.init();
    }

    private init() : void
    {
        if (this.form == null || !this.connected)
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
        this.init();
    }

    public disconnect() : void
    {
        this.app.disconnect();
        this.init();
    }

    public close() : void
    {
        this.form.close(false);
        this.init();
    }
}