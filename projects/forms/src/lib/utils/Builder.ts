import { Injectable, Injector, ComponentFactoryResolver, ComponentRef, ApplicationRef } from '@angular/core';

@Injectable({
    providedIn: 'root',
})


export class Builder
{
    constructor(private resolver:ComponentFactoryResolver, private injector:Injector, private app:ApplicationRef) {}

    public createComponent(component:any) : ComponentRef<any>
    {
        let cref:ComponentRef<any> = this.resolver.resolveComponentFactory(component).create(this.injector);
        return(cref);
    }


    public getAppRef() : ApplicationRef
    {
        return(this.app);
    }
}
