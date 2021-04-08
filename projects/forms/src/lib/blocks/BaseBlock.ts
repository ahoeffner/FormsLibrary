import { BlockImpl } from "./BlockImpl";

export class BaseBlock
{
    public impl:BlockImpl;

    constructor()
    {
        this.impl = new BlockImpl(null);
    }
}