import { Form } from "../forms/Form";
import { MenuHandler } from './MenuHandler';
import { Transaction } from '../database/Transaction';


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

    public onTransactio(action:Transaction) : void
    {
    }

    public onFormChange(form: Form): void
    {
        this.form = form;
        if (this.ready) this.init();
    }

    private init() : void
    {
        if (this.form != null && this.connected)
        {
            this.enable();
        }
        else
        {
            this.disable();
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