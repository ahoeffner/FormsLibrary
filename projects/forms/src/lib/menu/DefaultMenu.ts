import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';
import { MenuHandler } from './MenuHandler';
import { DefaultMenuHandler } from './DefaultMenuHandler';


export class DefaultMenu implements Menu
{
    private entries: MenuEntry[];
    private handler: DefaultMenuHandler;

    constructor()
    {
        this.entries =
        [
            {
                name: "Form", title: "Form actions", options:
                [
                    {name: "enter query",       action: "enterFormQuery"},
                    {name: "execute query",     action: "executeFormQuery"},
                    {name: "clear",             action: "clear"},
                    {name: "close",             action: "close"},
                    {name: "shortkeys",         action: "showkeymap"},
                ]
            }
            ,
            {
                name: "Section", title: "Block actions", options:
                [
                    {name: "enter query",     action: "enterQuery"},
                    {name: "execute query",   action: "executeQuery"},
                    {name: "clear filter",    action: "executeQuery"},
                    {name: "next",            action: "nextBlock"},
                    {name: "previous",        action: "prevBlock"},
                ]
            }
            ,
            {
                name: "Record", title: "Record actions", options:
                [
                    {name: "insert below",  action: "insertRecordAfter"},
                    {name: "insert above",  action: "insertRecordBefore"},
                    {name: "delete",        action: "deleteRecord"},
                    {name: "next",          action: "nextRecord"},
                    {name: "previous",      action: "prevRecord"},
                    {name: "pagedown",      action: "pageDown"},
                    {name: "pageup",        action: "pageUp"},
                ]
            }
            ,
            {
                name: "Transaction", title: "Transaction Menu", options:
                [
                    {name: "commit", action: "commit"},
                    {name: "rollback", action: "rollback"},
                ]
            }
            ,
            {
                name: "Connection", title: "Connection to database", options:
                [
                    {name: "connect",    action: "connect"},
                    {name: "disconnect", action: "disconnect"},
                ]
            }
        ];

        this.handler = new DefaultMenuHandler();
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