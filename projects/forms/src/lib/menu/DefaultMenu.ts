import { Menu } from './Menu';
import { Form } from '../forms/Form';
import { MenuEntry } from './MenuEntry';
import { MenuHandler } from './MenuHandler';
import { DefaultMenuHandler } from './DefaultMenuHandler';


export class DefaultMenu implements Menu
{
    private form:Form;
    private entries: MenuEntry[];
    private handler: DefaultMenuHandler;

    constructor()
    {
        this.entries =
        [
            {
                name: "Connection", title: "Connection to database", options:
                [
                    {name: "connect", action: "connect"},
                    {name: "disconnect", action: null},
                ]
            }
            ,
            {
                name: "Query", title: "Query actions", options:
                [
                    {name: "enter", action: null},
                    {name: "execute", action: null},
                    {name: "cancel", action: null},
                ]
            }
            ,
            {
                name: "Record", title: "Record actions", options:
                [
                    {name: "insert", action: null},
                    {name: "delete", action: null},
                    {name: "clear", action: null},
                ]
            }
            ,
            {
                name: "Block", title: "Block actions", options:
                [
                    {name: "clear", action: null},
                ]
            }
            ,
            {
                name: "Form", title: "Form actions", options:
                [
                    {name: "clear", action: null},
                    {name: "close", action: "close"},
                ]
            }
            ,
            {
                name: "Transaction", title: "Transaction Menu", options:
                [
                    {name: "commit", action: null},
                    {name: "rollback", action: null},
                ]
            }
        ];

        this.handler = new DefaultMenuHandler();
    }


    private init() : void
    {
        if (this.form == null)
        {
            this.handler.menu.disable();
            this.handler.menu.enable("/connection");
        }
        else
        {
            this.handler.menu.enable();
        }
    }


    public activate() : void
    {
        this.init();
    }


    public deactivate() : void
    {
    }


    public setForm(form: Form): void
    {
        this.form = form;
        this.handler.form = form;
        if (this.handler.ready) this.init();
    }

    getHandler(): MenuHandler
    {
        return(this.handler);
    }

    getEntries(): MenuEntry[]
    {
        return(this.entries);
    }
}