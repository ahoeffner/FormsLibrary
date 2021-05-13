import { ApplicationImpl } from '../application/ApplicationImpl';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, EmbeddedViewRef, ViewChild } from '@angular/core';


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
            height: 0;
        }

        .wait-canvas
        {
            top: 40%;
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Wait implements AfterViewInit
{
    private static app:ApplicationImpl = null;
    private static win:ComponentRef<Wait> = null;


    public static show(app:ApplicationImpl) : void
    {
        if (Wait.app != null)
            return;

        Wait.app = app;
        console.log("show");
        Wait.win = app.builder.createComponent(Wait);

        let element:HTMLElement = (Wait.win.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        app.builder.getAppRef().attachView(Wait.win.hostView);

        document.body.appendChild(element);
    }


    public static waiting() : boolean
    {
        return(Wait.win != null);
    }


    public static close() : void
    {
        if (Wait.win == null)
            return;

        console.log("hide");
        let element:HTMLElement = (Wait.win.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		Wait.app.builder.getAppRef().detachView(Wait.win.hostView);
		Wait.win.destroy();

        Wait.win = null;
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
        setTimeout(() => {this.input.focus()},1);
        this.draw(ctx,0);
    }


    private draw(ctx:CanvasRenderingContext2D, pick:number) : void
    {
        ctx.lineWidth = 5;
        let pcolor:string = "black";
        let bcolor:string = "#DCDCDC";

        pick = pick % 3;
        let rad:number = 6;
        let off:number = 64;

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 0) ctx.strokeStyle=pcolor;

        ctx.arc(rad+off, 2*rad+off, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 1) ctx.strokeStyle=pcolor;

        ctx.arc(6*rad+off, 2*rad+off, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        ctx.strokeStyle=bcolor;
        if (pick == 2) ctx.strokeStyle=pcolor;

        ctx.arc(11*rad+off, 2*rad+off, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        setTimeout(() => this.draw(ctx,pick+1), 250);
    }
}