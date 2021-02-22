import { Form } from "../forms/Form";
import { MenuHandler } from './MenuHandler';


export class DefaultMenuHandler extends MenuHandler
{
    public form:Form;

    public activate() : void
    {
        this.init();
    }

    private init() : void
    {
        if (this.form == null)
        {
            this.menu.disable();
            this.menu.enable("/connection");
        }
        else
        {
            this.menu.enable();
        }
    }

    public setForm(form: Form): void
    {
        this.form = form;
        if (this.ready) this.init();
    }


    public connect() : void
    {
        console.log("connect");
    }

    public disconnect() : void
    {
        console.log("disconnect");
    }

    public close() : void
    {
        this.form.close(false);
    }
}