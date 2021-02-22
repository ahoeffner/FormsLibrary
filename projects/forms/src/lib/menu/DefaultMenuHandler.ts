import { Form } from "../forms/Form";
import { MenuHandler } from './MenuHandler';


export class DefaultMenuHandler extends MenuHandler
{
    public form:Form;

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