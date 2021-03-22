import { BindValue } from "./BindValue";

export class Condition
{
    private value$:string;
    private column$:string;
    private operator$:string;
    private datatype$:string;
    private level$:number = 0;
    private type$:string = "and";
    private prev$:Condition = null;
    private next$:Condition = null;


    public static where(column:string, value:string, operator?:string) : Condition
    {
        let where:Condition = new Condition(column,value,operator);
        return(where);
    }


    constructor(column:string, value:string, datatype?:string)
    {
        this.column$ = column;
        let numeric:boolean = !isNaN(+value);

        if (value == null)
        {
            this.value$ = "null";
            this.operator$ = "is";
            return;
        }

        this.operator$ = "";
        value = value.trim();
        let quoted:boolean = false;

        if (value.startsWith("<")) this.operator$ = "<";
        else if (value.startsWith(">")) this.operator$ = ">";

        if (this.operator$.length == 1)
        {
            value = value.substring(1).trim();
            if (value.startsWith("=")) this.operator$ += "=";
        }

        if (this.operator$.length == 2)
            this.value$ = value.substring(1).trim();

        if (value.startsWith('"') && value.endsWith('"'))
            value = "'"+value.substring(1,value.length-1)+"'";

        if (value.startsWith("'") && value.endsWith("'"))
            quoted = true;

        if (!quoted)
        {
            let like:boolean = false;
            if (value.indexOf("%") >= 0) like = true;
            if (value.indexOf("_") >= 0) like = true;
            if (like) this.operator$ = "like";
        }

        this.value$ = value.trim();
        if (this.operator$.length == 0) this.operator$ = "=";
        if (!quoted && !numeric) this.value$ = "'"+this.value$+"'";
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


    public bindvalues() : BindValue[]
    {
        let bindvalues:BindValue[] = [];
        let cd:Condition = this.first();

        while(cd != null)
        {
            bindvalues.push({name: cd.column$, value: cd.value$, type: cd.datatype$});
            cd =cd.next$;
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
            cd =cd.next$;
        }

        return(conditions);
    }


    public toString() : string
    {
        let nc:Condition = this;
        while(nc.prev$ != null) nc = nc.prev$;

        if (nc.next$ == null)
            return("where :"+nc.column$+" "+nc.operator$+" "+nc.value$);

        let str:string = (nc.level$ == 0) ? "where " : "where (";
        str += ":"+nc.column$+" "+nc.operator$+" "+nc.value$;
        if (nc.next$ != null) str += " "+nc.type$+" ";

        while(nc.next$ != null)
        {
            nc = nc.next$;
            if (+nc.level$ > 0) str += "(";
            str += ":"+nc.column$+" "+nc.operator$+" "+nc.value$;
            if (+nc.level$ < 0) str += ")";
            if (nc.next$ != null) str += " "+nc.type$+" ";
        }

        return(str);
    }
}