import { ApplicationImpl } from '../application/ApplicationImpl';
import { AfterViewInit, Component, ComponentRef, ElementRef, EmbeddedViewRef, ViewChild } from '@angular/core';


@Component({
    selector: '',
    template: `
                <div class="wait-modal">
                    <canvas #canvas class="wait-canvas" id="canvas"></canvas>
                    <input #input class="wait-input">
                </div>
              `,
    styles:
    [
        `
        .wait-input
        {
            width: 0;
            height: 0;
            opacity: 0;
            filter:alpha(opacity=0);
        }

        .wait-canvas
        {
            top: 25%;
            left: 40%;
            width: 320px;
            height: 160px;
            position: fixed;
        }

        .wait-modal
        {
            top: 0;
            left: 0;
            z-index: 1;
            opacity: 1;
            width: 100%;
            height: 100%;
            display: block;
            overflow: auto;
            position: fixed;
            box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .2);
        }
        `
    ]
})

export class Wait implements AfterViewInit
{
    private static ready:boolean = false;
    private static displayed:boolean = false;
    private static win:ComponentRef<Wait> = null;


    public static show(app:ApplicationImpl) : void
    {
        if (Wait.displayed)
            return;

        Wait.ready = false;
        Wait.displayed = true;
        Wait.win = app.builder.createComponent(Wait);

        let element:HTMLElement = (Wait.win.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        app.builder.getAppRef().attachView(Wait.win.hostView);

        document.body.appendChild(element);
        Wait.ready = true;
    }


    public static waiting() : boolean
    {
        return(Wait.displayed);
    }


    public static close(app:ApplicationImpl) : void
    {
        if (!Wait.displayed)
            return;

        if (!Wait.ready)
        {
            setTimeout(() => {Wait.close(app)},1);
            return;
        }

        Wait.displayed = false;
        let element:HTMLElement = (Wait.win.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		app.builder.getAppRef().detachView(Wait.win.hostView);
		Wait.win.destroy();

        app.getCurrentForm().focus();
    }


    private input:HTMLInputElement = null;
    private canvas:HTMLCanvasElement = null;

    @ViewChild("input", {read: ElementRef}) private inputElement: ElementRef;
    @ViewChild("canvas", {read: ElementRef}) private canvasElement: ElementRef;


    public ngAfterViewInit(): void
    {
		this.input = this.inputElement?.nativeElement as HTMLInputElement;
		this.canvas = this.canvasElement?.nativeElement as HTMLCanvasElement;
        let ctx:CanvasRenderingContext2D = this.canvas.getContext("2d");
        setTimeout(() => {this.focus()},10);
        setTimeout(() => {this.showrunning(ctx,0)},250);
    }


    private focus() : void
    {
        if (!Wait.displayed)
            return;

        this.input.focus();
        setTimeout(() => {this.focus()},100);
    }


    private showrunning(ctx:CanvasRenderingContext2D, pick:number) : void
    {
        if (!Wait.displayed)
            return;

        ctx.lineWidth = 5;
        let pcolor:string = "black";
        let bcolor:string = "#DCDCDC";

        pick = pick % 3;
        let rad:number = 6;
        let off:number = 64;

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 0) ctx.strokeStyle=pcolor;

        ctx.arc(rad+off, 2*rad, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 1) ctx.strokeStyle=pcolor;

        ctx.arc(6*rad+off, 2*rad, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 2) ctx.strokeStyle=pcolor;

        ctx.arc(11*rad+off, 2*rad, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        setTimeout(() => {this.showrunning(ctx,pick+1)}, 250);
    }
}