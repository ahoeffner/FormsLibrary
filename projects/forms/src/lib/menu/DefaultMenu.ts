import { Menu } from './Menu';
import { DropDownEntry } from './DropDownEntry';


export class DefaultMenu implements Menu
{
    handler: any;
    entries: DropDownEntry[];

    constructor()
    {
        this.entries =
        [
            {
                name: "Test", title: "Title", options:
                [
                    {name: "file", action: null},
                    {name: "exit", action: null},
                ]
            }
        ];
    }
}