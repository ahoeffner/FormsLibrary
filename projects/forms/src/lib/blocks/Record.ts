import { Field } from "../input/Field";
import { FieldInstance } from "../input/FieldInstance";


export enum RecordState
{
    na,
    qmode,
    insert,
    update
}


export class Record
{
    private row$:number = 0;
    private fields$:Field[] = [];
    private current$:boolean = false;
    private enabled$:boolean = false;
    private state$:RecordState = RecordState.na;
    private index:Map<string,Field> = new Map<string,Field>();


    constructor(row:number, fields:Field[], index:Map<string,Field>)
    {
        this.row$ = row;
        this.index = index;
        this.fields$ = fields;
    }

    public set row(row:number)
    {
        this.row$ = row;
    }

    public get row() : number
    {
        return(this.row$);
    }

    public get fields() : Field[]
    {
        return(this.fields$);
    }

    public focus() : void
    {
        for(let i = 0; i < this.fields$.length; i++)
            if (this.fields$[i].focus()) return;
    }

    public set current(flag:boolean)
    {
        this.current$ = flag;
        this.fields$.forEach((field) => {field.current = flag});
    }

    public get current() : boolean
    {
        return(this.current$);
    }

    public clear() : void
    {
        this.fields$.forEach((field) => {field.value = null; field.disable()});
        if (this.current) this.fields$.forEach((field) => {field.current = true; field.disable()});
    }

    public set state(state:RecordState)
    {
        this.state$ = state;
        this.fields$.forEach((field) => {field.state = state});
    }

    public get state() : RecordState
    {
        return(this.state$);
    }

    public get enabled() : boolean
    {
        return(this.enabled$);
    }

    public get readonly() :boolean
    {
        for(let i = 0; i < this.fields$.length; i++)
            if (!this.fields$[i].readonly) return(false);

        return(true);
    }

    public enable(readonly?:boolean) : void
    {
        this.enabled$ = true;
        this.fields$.forEach((field) => {field.enable(readonly)});
    }

    public disable() : void
    {
        this.enabled$ = false;
        this.fields$.forEach((field) => {field.disable()});
    }

    public getField(name:string) : Field
    {
        if (name == null) return(null);
        return(this.index.get(name.toLowerCase()));
    }

    public getFieldByGuid(name:string, guid:string) : FieldInstance
    {
        let field:Field = this.index.get(name.toLowerCase());
        if (field != null) return(field.getInstance(guid));
        return(null);
    }
}