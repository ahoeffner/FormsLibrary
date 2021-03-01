import { Container } from "./Container";
import { Builder } from "../utils/Builder";


export class ContainerControl
{
    private buiding:Container;

    constructor(private builder:Builder) {}


    public setBuild(form:any) : void
    {
        this.buiding = form;
    }


    public getBuild() : any
    {
        return(this.buiding);
    }
}