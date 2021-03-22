import { Condition } from "./Condition";

export enum SQLType
{
    call,
    select,
    insert,
    update,
    delete
}


export class Statement
{
    public sql:string = null;
    public type:SQLType = null;
    public conditions:Condition[] = [];


    constructor(arg?:SQLType|string)
    {
        if (arg != null)
        {
            if (arg.constructor.name == "String") this.sql = ""+arg;
            else this.type = arg as SQLType;
        }
    }

    public set(column:string, value:any) : Statement
    {
        this.conditions.push(new Condition(column,value));
        return(this);
    }

    public add(condition:Condition) : Statement
    {
        this.conditions.push(condition)
        return(this);
    }

    public addAll(conditions:Condition[]) : Statement
    {
        conditions.forEach((cond) => {this.conditions.push(cond)});
        return(this);
    }
}