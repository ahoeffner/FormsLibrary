import { ApplicationImpl } from '../application/ApplicationImpl';
import { AfterViewInit, Component, ComponentRef, ElementRef, EmbeddedViewRef, ViewChild } from '@angular/core';


@Component({
    template:
    `
    <div class="modal">
	    <img src="/assets/images/waiting.gif">
        <input #cursor style="height: 0">
    </div>
    `,
    styles:
    [
    `
        .modal
        {
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: block;
            overflow: auto;
            position: fixed;
        }

        img
        {
            top: 40%;
            left: 40%;
            height: 40px;
            position: fixed;
        }
    `
    ]
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

		let element:HTMLElement = (Wait.win.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		document.body.removeChild(element);

		Wait.app.builder.getAppRef().detachView(Wait.win.hostView);
		Wait.win.destroy();

        Wait.win = null;
    }


    private cursor:HTMLInputElement = null;
    @ViewChild("cursor", {read: ElementRef}) private cursorElement: ElementRef;

    public ngAfterViewInit(): void
    {
		this.cursor = this.cursorElement?.nativeElement as HTMLInputElement;
        setTimeout(() => {this.cursor.focus();},1);
    }
}