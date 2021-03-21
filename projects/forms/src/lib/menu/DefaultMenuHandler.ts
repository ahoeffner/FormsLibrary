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

    public onTransactionChange(): void
    {
    }

    private init() : void
    {
        this.disable();

        if (this.form != null)
        {
            if (this.connected) this.enable();
            else this.enable("/form/close");
            this.disable("/transaction");
        }

        if (this.connected)
        {
            this.disable("/connection/connect");
            this.enable("/connection/disconnect");
        }
        else
        {
            this.enable("/connection/connect");
            this.disable("/connection/disconnect");
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