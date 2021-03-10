import { Field } from "../input/Field";
import { FieldInstance } from "../input/FieldInstance";


export class ContainerBlock
{
    private name$:string;
    private fields:Map<number,FieldInstance> = new Map<number,FieldInstance>();
    private records:Map<number,ContainerRecord> = new Map<number,ContainerRecord>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public add(field:FieldInstance) : void
    {
        let row:number = field.row;
        let rec:ContainerRecord = this.records.get(row);

        this.fields.set(field.guid,field);

        if (rec == null)
        {
            rec = new ContainerRecord(row);
            this.records.set(+row,rec);
        }

        rec.add(field);
    }

    public getFields() : Map<number,FieldInstance>
    {
        return(this.fields);
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
    public row:number;
    public fields:Field[] = [];
    public index:Map<string,Field> = new Map<string,Field>();

    constructor(row:number)
    {
        this.row = row;
    }

    public add(field:FieldInstance) : void
    {
        let group:Field = this.index.get(field.name);

        if (group == null)
        {
            group = new Field(field.name);
            this.index.set(field.name,group);
            this.fields.push(group);
        }

        group.add(field);
        field.group = group;
    }
}


export class Container
{
    private id:number = 0;
    private blocks:Map<string,ContainerBlock> = new Map<string,ContainerBlock>();

    public register(field:FieldInstance) : void
    {
        field.guid = this.id++;
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