import { PopupWindow } from "./PopupWindow";

export class PopupImpl
{
    private width:string;
    private win:PopupWindow;

    constructor(public component:any) {}

    public setPopupWindow(win:PopupWindow) : void
    {
        this.win = win;
    }

    public close() : void
    {
        this.win.close();
    }
}