import { BindValue } from "./BindValue";
import { Condition } from "./Condition";

export enum SQLType
{
    call,
    select,
    insert,
    update,
    delete
}


export interface SQL
{
    sql:string;
    bindvalues:BindValue[];
}


export class Statement
{
    private sql$:string = null;
    private type$:SQLType = null;
    private columns$:string[] = [];
    private condition$:Condition = null;
    private bindvalues:BindValue[] = [];


    constructor(arg:SQLType|string)
    {
        if (arg != null)
        {
            if (arg.constructor.name == "String") this.sql$ = ""+arg;
            else this.type$ = arg as SQLType;
        }

        if (this.sql$ != null)
        {
            this.type$ = SQLType.call;
            let test:string = this.sql$.substring(0,7).trim().toLowerCase();

            if (test == "select") this.type$ = SQLType.select;
            if (test == "insert") this.type$ = SQLType.insert;
            if (test == "update") this.type$ = SQLType.update;
            if (test == "delete") this.type$ = SQLType.delete;
        }
    }

    public set type(type:SQLType)
    {
        this.type$ = type;
    }

    public set columns(columns:string|string[])
    {
        if (columns.constructor.name == "String")
        {
            this.columns$.push(""+columns);
        }
        else
        {
            (columns as String[]).forEach((column) =>
            {
                this.columns$.push(""+column);
            });
        }
    }

    public set condition(condition:Condition|Condition[])
    {
        if (condition.constructor.name == "Array")
        {
            let arr:Condition[] = condition as Condition[];

            this.condition$ = arr[0];

            for(let i = 1; i < arr.length; i++)
                this.condition$ = this.condition$.and().next(arr[i]);

            this.condition$ = this.condition$.first();
        }
        else
        {
            this.condition$ = condition as Condition;
        }
    }

    public pop() : Statement
    {
        if (this.condition$ != null)
            this.condition$.pop();
        return(this);
    }

    public push() : Statement
    {
        if (this.condition$ != null)
            this.condition$.push();
        return(this);
    }

    public and(column:string, value:any, datatype?:string) : Statement
    {
        if (this.condition$ == null)
        {
            this.condition$ = new Condition(column,value,datatype);
        }
        else
        {
            let cd:Condition = new Condition(column,value,datatype);
            this.condition$ = this.condition$.and().next(cd);
        }

        return(this);
    }

    public or(column:string, value:any, datatype?:string) : Statement
    {
        if (this.condition$ == null)
        {
            this.condition$ = new Condition(column,value,datatype);
        }
        else
        {
            let cd:Condition = new Condition(column,value,datatype);
            this.condition$ = this.condition$.or().next(cd);
        }

        return(this);
    }

    public returnvalue(column:string, datatype?:string) : Statement
    {
        this.bindvalues.unshift({name: column, value: null, type: datatype});
        return(this);
    }

    public bind(column:string, value:any, datatype?:string) : Statement
    {
        this.bindvalues.push({name: column, value: value, type: datatype});
        return(this);
    }

    public build() : SQL
    {
        let sql:string = this.sql$;

        if (sql == null && this.type$ != SQLType.call)
            sql += SQLType[this.type$] + " ";

        if (this.columns$ != null)
        {
            for(let i = 0; i < this.columns$.length - 1; i++)
                sql += this.columns$[i]+", ";

            sql += this.columns$[this.columns$.length-1];
        }

        if (this.condition$ != null)
            sql += " "+this.condition$.toString();

        let bindvalues:BindValue[] = this.bindvalues;
        this.condition$.bindvalues().forEach((bind) => {bindvalues.push(bind);});

        return({sql: sql, bindvalues: bindvalues});
    }
}