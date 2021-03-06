import { Field } from "../input/Field";
import { FieldInstance } from "../input/FieldInstance";


export class Container
{
    private fields$:FieldInstance[] = [];
    private blocks:Map<string,ContainerBlock> = new Map<string,ContainerBlock>();

    public register(field:FieldInstance) : void
    {
        let bname:string = field.block;
        let block:ContainerBlock = this.blocks.get(bname);

        if (block == null)
        {
            block = new ContainerBlock(bname);
            this.blocks.set(bname,block);
        }

        block.add(field);
        block.fields.push(field);
        this.fields$.push(field);
    }

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
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

    public finish() : void
    {
        this.blocks.forEach((block) => {block["finish"]();});
    }
}

export class ContainerBlock
{
    private name$:string;
    private rows$:number = 0;
    private fields$:FieldInstance[] = [];
    private current$:FieldInstance[] = [];
    private records$:Map<number,ContainerRecord> = new Map<number,ContainerRecord>();

    constructor(name:string)
    {
        this.name$ = name;
    }

    public get name() : string
    {
        return(this.name$);
    }

    public get rows() : number
    {
        return(this.rows$);
    }

    public add(field:FieldInstance) : void
    {
        let row:number = field.row;

        if (field.row == -1)
        {
            this.current$.push(field);
            return;
        }

        let rec:ContainerRecord = this.records$.get(+row);

        if (rec == null)
        {
            rec = new ContainerRecord(row);
            this.records$.set(+row,rec);

            if (field.row > this.rows$)
                this.rows$ = field.row;
        }

        rec.add(field);
    }

    public get fields() : FieldInstance[]
    {
        return(this.fields$);
    }

    public get records() : ContainerRecord[]
    {
        let recs:ContainerRecord[] = [];
        this.records$.forEach((rec) => {recs.push(rec)});
        let sorted:ContainerRecord[] = recs.sort((a,b) => {return(a.row - b.row)});
        return(sorted);
    }

    public getRecord(row:number) : ContainerRecord
    {
        return(this.records$.get(+row));
    }

    private finish() : void
    {
        if (this.rows$ == 0)
        {
            let rec:ContainerRecord = new ContainerRecord(0);
            this.records$.set(0,rec);

            this.current$.forEach((field) =>
            {
                field.row = 0;
                rec.add(field);
            });

            this.current$ = [];
        }
        else
        {
            this.records$.forEach((rec) =>
            {
                this.current$.forEach((inst) =>
                {
                    let group:Field = rec.index.get(inst.name);
                    if (group != null) group.add(inst)
                    else rec.add(inst);
                });
            });
        }
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
            group = new Field(field.name,this.row);
            this.index.set(field.name,group);
            this.fields.push(group);
        }

        group.add(field);
    }
}