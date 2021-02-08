import { ApplicationImpl } from "../application/ApplicationImpl";

export class FormImpl
{
    private app:ApplicationImpl;

    public setApp(app:ApplicationImpl) : void
    {
        this.app = app;
    }
}