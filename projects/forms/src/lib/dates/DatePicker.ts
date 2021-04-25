import { Popup } from "../popup/Popup";
import { BlockImpl } from "../blocks/BlockImpl";
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
    public width?:string = "300px";
    public height?:string = "280px";
    public title:string = "Calendar";

    private win:PopupWindow = null;
    private cal:HTMLDivElement = null;
    private days:HTMLDivElement = null;
    private years:HTMLSelectElement = null;
    private months:HTMLSelectElement = null;

    @ViewChild("calendar", {read: ElementRef}) private calelem: ElementRef;


    public static show(app:ApplicationImpl, impl:BlockImpl)
    {
        let pinst:PopupInstance = new PopupInstance();
        pinst.display(app,DatePicker);

        let dpwin:DatePicker = pinst.popup() as DatePicker;
    }


    public close(cancel: boolean): void
    {
    }


    public setWin(win: PopupWindow): void
    {
        this.win = win;
    }


    public ngAfterViewInit(): void
    {
		this.cal = this.calelem?.nativeElement as HTMLDivElement;
        this.build(new Date(),10);
    }


    public build(date:Date, years:number) : void
    {
        this.styles();

        let month:number = date.getUTCMonth();
        let year:number = date.getUTCFullYear();

        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        this.years = document.createElement("select");
        this.months = document.createElement("select");

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

        for (let i = year - years/2; i < year + years/2; i++)
        {
            let option = document.createElement("option");

            option.text = i+"";
            option.value = i+"";

            this.years.appendChild(option);
        }

        this.years.selectedIndex = years/2;
        this.cal.appendChild(this.years);

        this.days = document.createElement("div");

        this.days.classList.add("datepicker-days");
        this.cal.appendChild(this.days);

        this.draw();
        this.months.focus();
   }


   private draw() : void
   {
        let year:number = +this.years.value;
        let month:number = +this.months.value;

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

        let total:number = 35;
        let used:number = squares.length;

        for (let i = used; i < total; i++)
            squares.push([false,i]);

        let names:string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                cell.innerHTML = (+squares[i][1] + +1)+"";
                cell.classList.add("datepicker-day");
            }
            else
            {
                cell.classList.add("datepicker-blank");
            }
        }

        this.days.innerHTML = "";
        this.days.appendChild(table);
    }


    private styles() : void
    {
        this.cal.innerHTML =
        `
        <style>
            .datepicker-month
            {
                width: 64px;
                font-size: 15px;
            }

            .datepicker-year
            {
                width: 64px;
                font-size: 15px;
                margin-left: 32px;
            }

            .datepicker-table
            {
                color: #333;
                border-collapse: separate;
                width: 100%;
                margin-top: 10px;
            }

            .datepicker-day
            {
                color: #fff;
                padding: 5px;
                width: 14.28%;
                text-align: center;
                background: #2d68c4;
            }

            .datepicker-blank
            {
                background: #ddd;
            }

            /* TODAY */
            .picker-d-td
            {
                background: #ffe0d4;
            }

            .datepicker-day:hover
            {
                color: #fff;
                cursor: pointer;
                background: #2d68c4;
            }
        </style>
        `;
    }
}