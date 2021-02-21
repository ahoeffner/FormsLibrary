import { Menu } from './Menu';
import { Builder } from "../utils/Builder";
import { ComponentRef } from '@angular/core';
import { DropDownMenu } from './DropDownMenu';


export class MenuFactory
{
    constructor(private builder:Builder) {}

    public create(menu?:Menu) : ComponentRef<DropDownMenu>
    {
        let ref:ComponentRef<DropDownMenu> = this.builder.createComponent(DropDownMenu);
        (ref.instance as DropDownMenu).display(menu);
        return(ref);
    }
}