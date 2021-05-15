import { Column } from "./Column";
import { dates } from "../dates/dates";
import { BindValue } from "./BindValue";


export class Condition
{
    private value$:any;
    private error$:string;
    private column$:string;
    private placeholder$:any;
    private operator$:string;
    private datatype$:Column;
    private condition$:string;
    private level$:number = 0;
    private type$:string = "and";
    private prev$:Condition = null;
    private next$:Condition = null;
    private bindvalues$:BindValue[] = [];

    private static id:number = 1;

    private static ubid() : string
    {
        if (++Condition.id > 9999)
            Condition.id = 1;

        let ubid:string = ""+Condition.id;
        while(ubid.length < 4) ubid = "0"+ubid;

        return("_"+ubid);
    }


    public static where(column:string, value:string, datatype?:Column) : Condition
    {
        let condition:Condition = new Condition(column,value,datatype);
        condition.type$ = "where";
        return(condition);
    }


    constructor(column:string, value:any, datatype?:Column)
    {
        this.error$ = null;
        this.column$ = column;
        this.datatype$ = datatype;
        this.placeholder$ = column + Condition.ubid();

        if (this.column$ == null)
        {
            this.error$ = "cannot construct condition on unspecified column. Value = "+value;
            return;
        }

        if (value != null)
        {
            let type:string = value.constructor.name.toLowerCase();

            if (type == "date")
            {
                this.datatype$ = Column.date;
                this.value$ = (value as Date).getTime();

                this.datebtwn();

                this.bindvalues$.push({name: this.placeholder$[0], value: this.value$[0], type: this.datatype$});
                this.bindvalues$.push({name: this.placeholder$[1], value: this.value$[1], type: this.datatype$});

                return;
            }

            if (type == "number")
            {
                this.value$ = value;
                this.operator$ = "=";
                this.datatype$ = Column.decimal;
                this.bindvalues$.push({name: this.placeholder$, value: this.value$, type: this.datatype$});
                return;
            }
        }

        if (value != null && (value+"").trim().length > 0 && this.datatype$ == null)
        {
            value = (value+"").trim();
            let numeric:boolean = !isNaN(+value);
            if (numeric) this.datatype$ = Column.decimal;
        }

        if (value == null)
        {
            this.operator$ = "is null";
            return;
        }

        if (this.datatype$ == null)
            this.datatype$ = Column.varchar;

        this.operator$ = "";
        let quoted:boolean = false;

        if (value.startsWith("<")) this.operator$ = "<";
        else if (value.startsWith(">")) this.operator$ = ">";

        if (this.operator$.length == 1)
        {
            value = value.substring(1).trim();
            if (value.startsWith("=")) this.operator$ += "=";
        }

        if (this.operator$.length == 2)
            value = value.substring(1).trim();

        if (value.startsWith('"') && value.endsWith('"'))
        {
            quoted = true;
            value = value.substring(1,value.length-1);
        }

        if (value.startsWith("'") && value.endsWith("'"))
        {
            quoted = true;
            value = value.substring(1,value.length-1);
        }

        if (!quoted)
        {
            let like:boolean = false;
            if (value.indexOf("%") >= 0) like = true;
            if (value.indexOf("_") >= 0) like = true;
            if (like) this.operator$ = "like";
        }

        this.value$ = value.trim();
        if (this.operator$.length == 0) this.operator$ = "=";

        if (this.datatype$ == Column.decimal && isNaN(+this.value$))
        {
            this.error$ = "Unable to parse "+this.value$+" as number";
            return;
        }

        if (this.datatype$ == Column.integer && isNaN(+this.value$))
        {
            this.error$ = "Unable to parse "+this.value$+" as number";
            return;
        }

        if (this.datatype$ == Column.date)
        {
            let date:Date = dates.parse(this.value$);

            if (date == null)
            {
                this.error$ = "Unable to parse '"+this.value$+"' as date";
                return;
            }

            this.value$ = date.getTime();

            if (this.operator$ == "=")
                this.datebtwn();
        }


        if (this.operator$ != "between")
        {
            this.bindvalues$.push({name: this.placeholder$, value: this.value$, type: this.datatype$});
        }
        else
        {
            this.bindvalues$.push({name: this.placeholder$[0], value: this.value$[0], type: this.datatype$});
            this.bindvalues$.push({name: this.placeholder$[1], value: this.value$[1], type: this.datatype$});
        }
    }

    private datebtwn() : void
    {
        this.operator$ = "between";
        let sdate:number = this.value$;

        // add 24 hours - minus 1 sec
        let edate:number = sdate + 60 * 60 * 24 * 1000 - 1000;

        this.value$ = [sdate,edate];
        this.placeholder$ = [this.placeholder$+"_0",this.placeholder$+"_1"];
    }

    public get column() : string
    {
        return(this.column$);
    }

    public get placeholder() : string|string[]
    {
        return(this.placeholder$);
    }

    public getValue() : any
    {
        if (this.bindvalues$.length == 0)
            return(null);

        if (this.bindvalues$.length == 1)
            return(this.bindvalues$[0].value);

        if (this.bindvalues$.length > 1)
        {
            let vals:any[] = [];
            this.bindvalues$.forEach((bv) => {vals.push(bv.value)});
            return(vals);
        }
    }

    public setCondition(condition:string) : void
    {
        this.error$ = null;
        this.condition$ = condition;
    }

    public error() : string
    {
        return(this.error$)
    }

    public or() : Condition
    {
        this.type$ = "or";
        return(this);
    }


    public and() : Condition
    {
        this.type$ = "and";
        return(this);
    }

    public where() : Condition
    {
        this.type$ = "where";
        return(this);
    }


    public next(next?:Condition) : Condition
    {
        if (next == null) return(this.next$);

        if (this.next$ != null)
            this.next$.prev$ = next;

        this.next$ = next;
        next.prev$ = this;
        return(next);
    }


    public prev(prev?:Condition) : Condition
    {
        if (prev == null) return(this.prev$);

        if (this.prev$ != null)
            this.prev$.next$ = prev;

        this.prev$ = prev;
        prev.next$ = this;
        return(prev);
    }


    public first() : Condition
    {
        let pc:Condition = this;
        while(pc.prev$ != null) pc = pc.prev$;
        return(pc);
    }


    public last() : Condition
    {
        let nc:Condition = this;
        while(nc.next$ != null) nc = nc.next$;
        return(nc);
    }


    public pop() : Condition
    {
        this.level$ = -1;
        return(this);
    }


    public push() : Condition
    {
        this.level$ = +1;
        return(this);
    }


    public errors() : string[]
    {
        let errors:string[] = [];
        let cd:Condition = this.first();

        while(cd != null)
        {
            if (cd.error() != null)
                errors.push(cd.error());

            cd = cd.next$;
        }

        return(errors)
    }


    public getAllBindvalues() : BindValue[]
    {
        let bindvalues:BindValue[] = [];
        let cd:Condition = this.first();

        while(cd != null)
        {
            cd.bindvalues$.forEach((bindvalue) => {bindvalues.push(bindvalue)});
            cd = cd.next$;
        }

        return(bindvalues);
    }


    public split() : Condition[]
    {
        let conditions:Condition[] = [];
        let cd:Condition = this.first();

        while(cd != null)
        {
            conditions.push(cd);
            cd = cd.next$;
        }

        return(conditions);
    }


    public toString() : string
    {
        let nc:Condition = this;
        while(nc.prev$ != null) nc = nc.prev$;

        if (nc.next$ == null)
            return(nc.type$+" "+this.clause(nc));

        let str:string = (nc.level$ == 0) ? "where " : "where (";
        str += this.clause(nc);
        if (nc.next$ != null) str += " "+nc.type$+" ";

        while(nc.next$ != null)
        {
            nc = nc.next$;
            if (+nc.level$ > 0) str += "(";
            str += this.clause(nc);
            if (+nc.level$ < 0) str += ")";
            if (nc.next$ != null) str += " "+nc.type$+" ";
        }

        return(str);
    }


    private clause(cond:Condition) : string
    {
        if (cond.condition$ != null)
            return(cond.condition$);

        if (cond.operator$.startsWith("is"))
            return(cond.column$+" "+cond.operator$);

        else if (cond.operator$ == "between")
            return(cond.column$+" between :"+cond.placeholder$[0]+" and :"+cond.placeholder$[1]);

        else
            return(cond.column$+" "+cond.operator$+" :"+cond.placeholder$);
    }
}