import { Menu } from './Menu';
import { MenuEntry } from './MenuEntry';


export class DefaultMenu implements Menu
{
    handler: any;
    entries: MenuEntry[];

    constructor()
    {
        this.entries =
        [
            {
                name: "Connection", title: "Connection to database", options:
                [
                    {name: "connect", action: null},
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
                    {name: "close", action: null},
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
    }
}