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
                name: "File", title: "File Menu", options:
                [
                    {name: "file", action: null},
                    {name: "exit", action: null},
                ]
            }
            ,
            {
                name: "Transactions", title: "Transaction Menu", options:
                [
                    {name: "commit", action: null},
                    {name: "rollback", action: null},
                ]
            }
        ];
    }
}