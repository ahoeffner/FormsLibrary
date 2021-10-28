import { Popup } from "../popup/Popup";
import { KeyCodes } from "../keymap/KeyCodes";
import { BlockImpl } from "../blocks/BlockImpl";
import { Context } from "../application/Context";
import { PopupWindow } from "../popup/PopupWindow";
import { PopupInstance } from "../popup/PopupInstance";
import { ApplicationImpl } from "../application/ApplicationImpl";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";


@Component({
    template:
    `
        <div #calendar></div>
    `
})


export class DatePicker implements Popup, AfterViewInit
{
    public top:string = null;
    public left:string = null;
    public title:string = null;
    public width?:string = "256px";
    public height?:string = "256px";

    private field:string
    private record:number;
    private impl:BlockImpl;

    private cdate:Date = null;
    private app:ApplicationImpl;
    private win:PopupWindow = null;
    private cal:HTMLDivElement = null;
    private days:HTMLDivElement = null;
    private years:HTMLSelectElement = null;
    private months:HTMLSelectElement = null;

    @ViewChild("calendar", {read: ElementRef}) private calelem: ElementRef;


    public static show(app:ApplicationImpl, impl:BlockImpl, record:number, field:string, date:Date)
    {
        let pinst:PopupInstance = new PopupInstance();
        pinst.display(app,DatePicker);

        let datepicker:DatePicker = pinst.popup() as DatePicker;

        datepicker.date = date;
        datepicker.setDestination(impl,record,field);
    }


    constructor(private ctx:Context)
    {
        this.app = ctx.app["_impl_"];
        this.title = ctx.conf.calendarname;
    }


    public close(_cancel: boolean): void
    {
        this.win.closeWindow();
    }


    public set date(date:Date)
    {
        if (date == null) date = new Date();
        this.cdate = date;
    }


    public setDestination(impl:BlockImpl, record:number, field:string) : void
    {
        this.impl = impl;
        this.field = field;
        this.record = record;
    }


    private pick(event:any) : void
    {
        let year:number = +this.years.value;
        let month:number = +this.months.value;
        let day:number = +event.target.innerHTML;

        let cday:number = this.cdate.getUTCDate();
        let cmonth:number = this.cdate.getUTCMonth();
        let cyear:number = this.cdate.getUTCFullYear();

        if (year != cyear || month != cmonth || day != cday)
        {
            this.cdate = new Date(Date.UTC(year, month-1, day));

            // Truncate
            this.cdate = new Date(this.cdate.toDateString());

            this.impl.setValue(this.record,this.field,this.cdate);
            this.impl.focus();
        }

        this.close(false);
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngAfterViewInit(): void
    {
		this.cal = this.calelem?.nativeElement as HTMLDivElement;
        this.build(this.cdate,75,75);
    }


    public navigate(event:any) : void
    {
        if (event.keyCode == KeyCodes.tab)
        {
            event.preventDefault();

            if (event.target.name == "months") this.years.focus();
            else                               this.months.focus();

            return;
        }

        if (event.keyCode == KeyCodes.escape)
            this.close(true);
    }


    public weekdays(locale:string) : string[]
    {
        let fmt = new Intl.DateTimeFormat(locale,{weekday: "short"}).format;
        let names:string[] = [...Array(7).keys()].map((d) => fmt(new Date(Date.UTC(2021, 1, d))));

        for (let i = 0; i < 7; i++)
        {
            if (names[i].endsWith("."))
                names[i] = names[i].substring(0,names[i].length-1);
        }

        let sun:string = names[0];

        names.shift();
        names.push(sun);

        return(names);
    }


    public monthnames(locale:string) : string[]
    {
        let fmt = new Intl.DateTimeFormat(locale,{month: "short"}).format;
        let names:string[] = [...Array(12).keys()].map((m) => fmt(new Date(Date.UTC(2021, m))));

        for (let i = 0; i < 12; i++)
        {
            if (names[i].endsWith("."))
                names[i] = names[i].substring(0,names[i].length-1);
        }

        return(names);
    }


    public build(date:Date, bef:number, aft:number) : void
    {
        this.styles();

        let month:number = date.getUTCMonth();
        let year:number = date.getUTCFullYear();

        let months = this.monthnames(this.ctx.conf.locale);

        this.years = document.createElement("select");
        this.months = document.createElement("select");

        this.years.name = "years";
        this.months.name = "months";

        this.addFieldTriggers(this.years);
        this.addFieldTriggers(this.months);

        this.months.classList.add("datepicker-month");

        for (let i = 0; i < 12; i++)
        {
            let option = document.createElement("option");

            option.text = months[i];
            option.value = (i + 1)+"";

            this.months.appendChild(option);
        }

        this.months.selectedIndex = month;
        this.cal.appendChild(this.months);

        this.years.classList.add("datepicker-year");

        for (let i = year - bef; i < year + aft; i++)
        {
            let option = document.createElement("option");

            option.text = i+"";
            option.value = i+"";

            this.years.appendChild(option);
        }

        this.years.selectedIndex = bef;
        this.cal.appendChild(this.years);

        this.days = document.createElement("div");

        this.days.classList.add("datepicker-days");
        this.cal.appendChild(this.days);

        this.draw();

        let width:string = (1.25*this.cal.offsetWidth)+"px";
        let height:string = (1.10*this.cal.offsetHeight+32)+"px";

        this.win.resize(width,height);
        this.months.focus();
   }


   private draw() : HTMLTableElement
   {
        let cday:number = this.cdate.getDate();
        let cmonth:number = this.cdate.getMonth();
        let cyear:number = this.cdate.getFullYear();

        let year:number = +this.years.value;
        let month:number = +this.months.value;

        if (year != cyear || month != +cmonth + +1)
            cday = 0;

        let days:number = new Date(Date.UTC(year, month, 0)).getUTCDate();
        let first:number = new Date(Date.UTC(year, month-1, 1)).getUTCDay();
        let last:number = new Date(Date.UTC(year, month-1, days)).getUTCDay();

        last = last == 0 ? 7 : last;
        first = first == 0 ? 7 : first;

        let squares = [];

        for (let i = 1; i < first; i++)
            squares.push([false,0]);

        for (let i = 0; i < days; i++)
            squares.push([true,i]);

        while(squares.length%7 != 0)
            squares.push([false,0]);

        let names:string[] = this.weekdays(this.ctx.conf.locale);

        let table:HTMLTableElement = document.createElement("table");
        table.classList.add("datepicker-table");

        let row:HTMLTableRowElement = table.insertRow();

        names.forEach((day) =>
        {
            let cell:HTMLTableCellElement = row.insertCell();
            cell.classList.add("datepicker-head")
            cell.innerHTML = day;
        });

        for (let i = 0; i < squares.length; i++)
        {
            if (i%7 == 0) row = table.insertRow();
            let cell:HTMLTableCellElement = row.insertCell();

            if (squares[i][0])
            {
                let dom:number = +squares[i][1] + +1;

                cell.innerHTML = dom+"";
                cell.classList.add("datepicker-day");

                if (dom == cday) cell.classList.add("datepicker-current");
                this.addDayTriggers(cell);
            }
            else
            {
                cell.classList.add("datepicker-blank");
            }
        }

        this.days.innerHTML = "";
        this.days.appendChild(table);

        return(table);
    }


    private addDayTriggers(cell:HTMLTableCellElement) : void
    {
        cell.addEventListener("click",(event) => {this.pick(event)});
    }


    private addFieldTriggers(change:HTMLSelectElement) : void
    {
        change.addEventListener("change",() => {this.draw()});
        change.addEventListener("keydown",(event) => {this.navigate(event)});
    }


    private styles() : void
    {
        this.cal.innerHTML =
        `
        <style>
            .datepicker-month
            {
                font-size: 15px;
                margin-top: 16px;
                margin-left: 16px;
                width: fit-content;
            }

            .datepicker-year
            {
                font-size: 15px;
                margin-top: 16px;
                margin-left: 32px;
                width: fit-content;
            }

            .datepicker-table
            {
                width: 100%;
                margin-top: 14px;
                border-collapse: separate;
            }

            .datepicker-head
            {
                font-weight: bold;
                text-align: center;
                color: `+this.app.config.colors.text+`;
            }

            .datepicker-day
            {
                color: `+this.app.config.colors.buttontext+`;
                padding: 5px;
                width: 14.28%;
                text-align: center;
                background: `+this.app.config.colors.topbar+`;
            }

            .datepicker-blank
            {
                background: #ddd;
            }

            .datepicker-current
            {
                font-size: 16px;
                font-weight: bold;
            }

            .datepicker-day:hover
            {
                cursor: pointer;
                font-weight: bold;
                font-style: italic;
            }
        </style>
        `;
    }
}