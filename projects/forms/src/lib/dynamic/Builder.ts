import { Injectable, Injector, ComponentFactoryResolver, ComponentRef, ApplicationRef } from '@angular/core';

@Injectable({
    providedIn: 'root',
})


export class Builder
{
    public static builder:Builder = null;

    constructor(private resolver:ComponentFactoryResolver, private injector:Injector, private app:ApplicationRef)
    {
        if (Builder.builder == null) Builder.builder = this;
    }

    public createComponent<C>(component:any) : C
    {
        let cref:ComponentRef<any> = this.resolver.resolveComponentFactory(component).create(this.injector);
        cref.instance.init(this.app,cref);
        return(cref.instance as C);
    }
}
