import { PopupImpl } from "./PopupImpl";

export class Popup
{
    private handler:PopupImpl;

    private setImplHandler(handler:PopupImpl) : void
    {
        this.handler = handler;
    }

    public close() : void
    {
        this.handler.close();
    }
}