import { ComponentRef, ApplicationRef, EmbeddedViewRef } from '@angular/core';


export class Page
{
    private app: ApplicationRef;
    private ref:ComponentRef<any>;
    private element:HTMLElement = null;

    constructor() {}

    public init(app: ApplicationRef, ref:ComponentRef<any>)
    {
        this.app = app;
        this.ref = ref;
    }

    public display() : void
    {
        this.app.attachView(this.ref.hostView);
        this.element = (this.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(this.element);
    }

    public dismiss(destroy:boolean) : void
    {
        if (this.element != null)
        {
            document.body.removeChild(this.element);
            this.app.detachView(this.ref.hostView);
            this.element = null;
        }

        if (destroy) this.ref.destroy();
    }

    public getView() : HTMLElement
    {
        let element:HTMLElement = (this.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        return(element);
    }

    public getComponentRef() : ComponentRef<any>
    {
        return(this.ref);
    }
}