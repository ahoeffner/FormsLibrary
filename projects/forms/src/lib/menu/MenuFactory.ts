import { Menu } from './Menu';
import { Builder } from "../utils/Builder";
import { ComponentRef } from '@angular/core';
import { DropDownMenu } from './DropDownMenu';
import { ApplicationImpl } from '../application/ApplicationImpl';


export class MenuFactory
{
    constructor(private builder:Builder) {}

    public create(app:ApplicationImpl, menu?:Menu) : ComponentRef<DropDownMenu>
    {
        let ref:ComponentRef<DropDownMenu> = this.builder.createComponent(DropDownMenu);
        (ref.instance as DropDownMenu).display(app,menu);
        return(ref);
    }
}