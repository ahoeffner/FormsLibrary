export class Condition
{
    private value$:string;
    private column$:string;
    private operator$:string;
    private level$:number = 0;
    private type$:string = "and";
    private prev$:Condition = null;
    private next$:Condition = null;


    public static where(column:string, value:string, operator?:string) : Condition
    {
        let where:Condition = new Condition(column,value,operator);
        return(where);
    }


    constructor(column:string, value:string, operator?:string)
    {
        this.column$ = column;
        let numeric:boolean = !isNaN(+value);

        if (value == null)
        {
            this.value$ = "null";
            this.operator$ = "is";
            return;
        }

        if (operator != null)
        {
            this.value$ = value;
            this.operator$ = operator;
            if (!numeric) this.value$ = "'"+value.trim()+"'";
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
        {
            quoted = true;
            value = "'"+value.substring(1,value.length-1)+"'";
        }

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


    public next(next:Condition) : Condition
    {
        this.next$ = next;
        next.prev$ = this;
        return(next);
    }


    public pop() : Condition
    {
        if (this.prev$ == null) this.level$--;
        else this.level$ = +this.prev$.level$ - 1;
        return(this);
    }


    public push() : Condition
    {
        if (this.prev$ == null) this.level$++;
        else this.level$ = +this.prev$.level$ + 1;
        return(this);
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
            if (+nc.level$ > +nc.prev$.level$) str += "(";
            str += ":"+nc.column$+" "+nc.operator$+" "+nc.value$;
            if (+nc.level$ < +nc.prev$.level$) str += ")";
            if (nc.next$ != null) str += " "+nc.type$+" ";
        }

        return(str);
    }
}