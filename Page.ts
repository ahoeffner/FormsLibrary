import { Component, ComponentFactoryResolver, ComponentFactory, ViewContainerRef, Type, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';


@Component({
  selector: 'page',
  template:
  `
    <div *ngFor='let item of [].constructor(4); let row = index'>
      <div #layer class="page" id="{{row}}">
        <ng-template #template></ng-template>
      </div>
    </div>
  `,
  styles:
  [
    `
    .page
    {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      background: transparent;
    }
    `
  ]
})


export class Page implements AfterViewInit
{
  private layers:HTMLDivElement[] = null;
  private templates:ViewContainerRef[] = null;

    @ViewChildren("layer", {read: ElementRef}) private llist: QueryList<ElementRef>;
    @ViewChildren('template', {read: ViewContainerRef}) private tlist:QueryList<ViewContainerRef>;

    constructor(private resolver: ComponentFactoryResolver) { }


    public ngAfterViewInit(): void
    {
      this.templates = this.tlist.toArray();

      this.layers = [];
      let refs:ElementRef[] = this.llist.toArray();

      for(let i = 0; i < refs.length; i++)
      {
        this.layers[i] = refs[i].nativeElement;
        this.layers[i].style.setProperty("display","none");
        this.layers[i].style.setProperty("z-index",""+(i*32));
      }
    }


    public show(layer:number, page:Type<any>) : void
    {
      let factory:ComponentFactory<any> = this.resolver.resolveComponentFactory(page);

      this.templates[layer].clear();
      this.layers[layer].style.display = "block";
      this.templates[layer].createComponent(factory);
    }


    public hide(layer:number) : void
    {
      this.templates[layer].clear();
      this.layers[layer].style.display = "none";
    }
}
