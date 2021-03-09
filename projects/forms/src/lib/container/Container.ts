import { Field } from "../input/Field";
import { FieldGroup } from "../input/FieldGroup";

export class ContainerBlock
{
    private name$:string;
    private records:Map<number,ContainerRecord> = new Map<number,ContainerRecord>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public add(field:Field) : void
    {
        let row:number = field.row;
        let rec:ContainerRecord = this.records.get(row);

        if (rec == null)
        {
            rec = new ContainerRecord(row);
            this.records.set(+row,rec);
        }

        rec.add(field);
    }

    public getRecords() : ContainerRecord[]
    {
        let recs:ContainerRecord[] = [];
        this.records.forEach((rec) => {recs.push(rec)});
        let sorted:ContainerRecord[] = recs.sort((a,b) => {return(a.row - b.row)});
        return(sorted);
    }


    public getRecord(row:number) : ContainerRecord
    {
        return(this.records.get(+row));
    }
}


export class ContainerRecord
{
    private row$:number;
    private fields:FieldGroup[] = [];
    private index:Map<string,FieldGroup> = new Map<string,FieldGroup>();

    constructor(row:number)
    {
        this.row$ = row;
    }

    public get row() : number
    {
        return(this.row$);
    }

    public getFields() : FieldGroup[]
    {
        return(this.fields);
    }

    public getField(name:string) : FieldGroup
    {
        return(this.index.get(name.toLowerCase()));
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
        field.group = group;
    }
}


export class Container
{
    private blocks:Map<string,ContainerBlock> = new Map<string,ContainerBlock>();


    public register(field:Field) : void
    {
        let bname:string = field.block;
        let block:ContainerBlock = this.blocks.get(bname);

        if (block == null)
        {
            block = new ContainerBlock(bname);
            this.blocks.set(bname,block);
        }

        block.add(field);
    }

    public getBlock(block:string) : ContainerBlock
    {
        return(this.blocks.get(block.toLowerCase()));
    }

    public getBlocks() : ContainerBlock[]
    {
        let blocks:ContainerBlock[] = [];
        this.blocks.forEach((blk) => {blocks.push(blk)});
        return(blocks);
    }
}