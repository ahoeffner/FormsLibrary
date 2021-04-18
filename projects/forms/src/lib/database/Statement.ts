import { Column } from "./Column";
import { BindValue } from "./BindValue";
import { Condition } from "./Condition";

export enum SQLType
{
    call,
    lock,
    select,
    insert,
    update,
    delete
}


export interface SQL
{
    sql:string;
    rows?:number;
    cursor?:string;
    bindvalues:bindvalue[];
}


export interface bindvalue
{
    value:any;
    name:string;
    type:string;
}


export class Statement
{
    private sql$:string = null;
    private subquery$:SQL = null;
    private table$:string = null;
    private order$:string = null;
    private type$:SQLType = null;
    private cursor$:string = null;
    private columns$:string[] = [];
    private errors:string[] = null;
    private updates$:BindValue[] = [];
    private condition$:Condition = null;
    private bindvalues:BindValue[] = [];


    constructor(sql:string|SQLType)
    {
        if (sql != null)
        {
            if (sql.constructor.name == "String") this.sql$ = ""+sql;
            else this.type$ = sql as SQLType;
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

    public get type() : SQLType
    {
        return(this.type$);
    }

    public isFunction() : boolean
    {
        return(this.type == SQLType.call);
    }

    public isSelect() : boolean
    {
        return(this.type == SQLType.select);
    }

    public isInsert() : boolean
    {
        return(this.type == SQLType.insert);
    }

    public isUpdate() : boolean
    {
        return(this.type == SQLType.update);
    }

    public isDelete() : boolean
    {
        return(this.type == SQLType.delete);
    }

    public set table(table:string)
    {
        this.table$ = table;
    }

    public set order(order:string)
    {
        this.order$ = order;
    }

    public set cursor(cursor:string)
    {
        this.cursor$ = cursor;
    }

    public get cursor() : string
    {
        return(this.cursor$);
    }

    public update(name:string, value:any, datatype?:Column)
    {
        if (value != null && datatype == null)
        {
            let type:string = value.constructor.name.toLowerCase();

            if (type == "date")
            {
                datatype = Column.date;
                value = (value as Date).getTime();
            }

            if (type == "number")
                datatype = Column.decimal;
        }


        if (value != null && (value+"").trim().length > 0 && datatype == null)
        {
            value = (value+"").trim();
            let numeric:boolean = !isNaN(+value);
            if (numeric) datatype = Column.decimal;
        }

        if (datatype == null)
            datatype = Column.varchar;

        console.log("push update "+name+" = "+value)
        this.updates$.push({name: name, value: value, type: datatype});
    }

    public set columns(columns:string|string[])
    {
        this.columns$ = [];

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

    public where(column:string, value:any, datatype?:Column) : Statement
    {
        if (this.condition$ == null)
        {
            this.condition$ = new Condition(column,value,datatype);
            this.condition$.where();
        }
        else
        {
            let cd:Condition = new Condition(column,value,datatype);
            this.condition$ = this.condition$.where().next(cd);
        }

        return(this);
    }

    public and(column:string, value:any, datatype?:Column) : Statement
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

    public or(column:string, value:any, datatype?:Column) : Statement
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

    public returnvalue(column:string, datatype?:Column) : Statement
    {
        this.bindvalues.unshift({name: column, value: null, type: datatype});
        return(this);
    }

    public bind(column:string, value:any, datatype?:Column) : Statement
    {
        if (value != null && datatype == null)
        {
            let type:string = value.constructor.name.toLowerCase();

            if (type == "date")
            {
                datatype = Column.date;
                value = (value as Date).getTime();
            }

            if (type == "number")
                datatype = Column.decimal;
        }


        if (value != null && (value+"").trim().length > 0 && datatype == null)
        {
            value = (value+"").trim();
            let numeric:boolean = !isNaN(+value);
            if (numeric) datatype = Column.decimal;
        }

        if (datatype == null)
            datatype = Column.varchar;

        this.bindvalues.push({name: column, value: value, type: datatype});
        return(this);
    }

    public get subquery() : SQL
    {
        return(this.subquery$);
    }

    public set subquery(subquery:SQL)
    {
        this.subquery$ = subquery;
    }

    public validate() : string[]
    {
        if (this.errors != null)
            return(this.errors);

        this.errors = [];

        if (this.condition$ != null)
        this.errors = this.condition$.errors();

        return(this.errors);
    }

    public getCondition() : Condition
    {
        return(this.condition$);
    }

    public build() : SQL
    {
        switch(this.type)
        {
            case SQLType.call: return(this.buildcall());
            case SQLType.lock: return(this.buildselect());
            case SQLType.select: return(this.buildselect());
            case SQLType.insert: return(this.buildinsert());
            case SQLType.update: return(this.buildupdate());

            default: console.log("don't know hoe to build "+SQLType[this.type]);
        }
    }

    private buildcall() : SQL
    {
        let bindvals:bindvalue[] = [];

        this.bindvalues.forEach((bindv) =>
        {
            bindvals.push
            ({
                name: bindv.name,
                type: Column[bindv.type].toLowerCase(),
                value: bindv.value
            });
        });

        return({sql: this.sql$, bindvalues: bindvals});
    }

    private buildinsert() : SQL
    {
        let bindvals:bindvalue[] = [];

        this.bindvalues.forEach((bindv) =>
        {
            bindvals.push
            ({
                name: bindv.name,
                type: Column[bindv.type].toLowerCase(),
                value: bindv.value
            });
        });

        this.sql$ = "insert into "+this.table$+" (";

        for (let i = 0; i < bindvals.length; i++)
        {
            this.sql$ += bindvals[i].name;
            if (i < bindvals.length - 1) this.sql$ += ",";
        }

        this.sql$ += ") values (";

        for (let i = 0; i < bindvals.length; i++)
        {
            this.sql$ += ":"+bindvals[i].name;
            if (i < bindvals.length - 1) this.sql$ += ",";
        }

        this.sql$ += ")";

        return({sql: this.sql$, bindvalues: bindvals});
    }

    private buildupdate() : SQL
    {
        let updates:bindvalue[] = [];
        let bindvals:bindvalue[] = [];

        for (let i = 0; i < this.updates$.length; i++)
        {
            updates.push(
            {
                name: this.updates$[i].name,
                type: Column[this.updates$[i].type].toLowerCase(),
                value: this.updates$[i].value
            });
        }

        // Bindvalues for the update
        updates.forEach((bindv) => {bindvals.push(bindv)});

        let bindvalues:BindValue[] = this.bindvalues;

        if (this.condition$ != null)
            this.condition$.bindvalues().forEach((bind) => {bindvalues.push(bind);});

        // Bindvalues for the whereclause
        this.bindvalues.forEach((bindv) =>
        {
            bindvals.push
            ({
                name: bindv.name,
                type: Column[bindv.type].toLowerCase(),
                value: bindv.value
            });
        });

        this.sql$ = "update "+this.table$+" set ";

        for (let i = 0; i < updates.length; i++)
        {
            this.sql$ += updates[i].name + " = :"+updates[i].name;
            if (i < updates.length - 1) this.sql$ += ", ";
        }

        if (this.condition$ != null)
            this.sql$ += " "+this.condition$.toString();

        return({sql: this.sql$, bindvalues: bindvals});
    }

    private buildselect() : SQL
    {
        let sql:string = this.sql$;

        if (sql == null)
        {
            sql = "select ";

            if (this.columns$ != null)
            {
                for(let i = 0; i < this.columns$.length - 1; i++)
                    sql += this.columns$[i]+", ";

                sql += this.columns$[this.columns$.length-1];
            }

            if (this.table$ != null)
                sql += " from "+this.table$;
        }

        let bindvalues:BindValue[] = this.bindvalues;

        if (this.condition$ != null)
        {
            sql += " "+this.condition$.toString();
            this.condition$.bindvalues().forEach((bind) => {bindvalues.push(bind);});
        }

        let bindvals:bindvalue[] = [];

        bindvalues.forEach((bindv) =>
        {
            bindvals.push
            ({
                name: bindv.name,
                type: Column[bindv.type].toLowerCase(),
                value: bindv.value
            });
        });


        if (this.subquery$ != null)
        {
            sql += " "+this.subquery$.sql;
            this.subquery$.bindvalues.forEach((bindv) =>
            {bindvals.push(bindv)});
        }

        if (this.type$ == SQLType.select && this.order$ != null)
            sql += " order by "+this.order$;

        return({sql: sql, bindvalues: bindvals});
    }
}