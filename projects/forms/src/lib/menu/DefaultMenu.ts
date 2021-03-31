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
                name: "Connection", title: "Connection to database", options:
                [
                    {name: "connect",    action: "connect"},
                    {name: "disconnect", action: "disconnect"},
                ]
            }
            ,
            {
                name: "Query", title: "Query actions", options:
                [
                    {name: "enter",     action: "enterQuery"},
                    {name: "execute",   action: "executeQuery"},
                    {name: "cancel",    action: "cancelQuery"},
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
                name: "Block", title: "Block actions", options:
                [
                    {name: "next", action: null},
                    {name: "previous", action: null},
                ]
            }
            ,
            {
                name: "Form", title: "Form actions", options:
                [
                    {name: "clear", action: "clear"},
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

    getHandler(): MenuHandler
    {
        return(this.handler);
    }

    getEntries(): MenuEntry[]
    {
        return(this.entries);
    }
}