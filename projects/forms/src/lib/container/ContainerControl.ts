import { Container } from "./Container";
import { Builder } from "../utils/Builder";


export class ContainerControl
{
    private container:Container;

    constructor(private builder:Builder) {}


    public setContainer(container?:Container) : void
    {
        if (container == null) container = new Container();
        this.container = container;
    }


    public getContainer() : Container
    {
        let cont:Container = this.container;
        this.container = null;
        return(cont);
    }
}