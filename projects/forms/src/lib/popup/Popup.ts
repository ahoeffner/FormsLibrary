import { PopupWindow } from "./PopupWindow";

export interface Popup
{
    top?:string;
    left?:string;
    width?:string;
    height?:string;

    title:string;

    close(cancel:boolean) : void;
    setWin(win:PopupWindow) : void;
}