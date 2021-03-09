import { Field } from "../input/Field";
import { FieldGroup } from "../input/FieldGroup";

export class Record
{
    private row$:number;
    private fields:FieldGroup[];
    private index:Map<string,FieldGroup> = new Map<string,FieldGroup>();

    constructor(row:number)
    {
        this.row$ = row;
    }

    public get row() : number
    {
        return(this.row$);
    }

    public add(field:Field) : void
    {
        let group:FieldGroup = this.index.get(field.name);

        if (group == null)
        {
            group = new FieldGroup(field.name);
            this.index.set(field.name,group);
            this.fields.push(group);
        }

        group.add(field);
    }
}


export class Container
{
    private records:Map<number,Record> = new Map<number,Record>();

    public register(field:Field) : void
    {
        let row:number = field.row;

        let rec:Record = this.records.get(row);

        if (rec == null)
        {
            rec = new Record(row);
            this.records.set(row,rec);
        }

        rec.add(field);
    }


    public getRecords() : Record[]
    {
        let recs:Record[] = [];
        this.records.forEach((rec) => {recs.push(rec)});

        return(recs);
    }
}