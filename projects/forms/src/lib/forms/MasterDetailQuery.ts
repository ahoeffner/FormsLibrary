import { BlockImpl } from "../blocks/BlockImpl";
import { dependencies, MasterDetail } from "./MasterDetail";


export class MasterDetailQuery
{
    private root$:BlockImpl;
    private finished:number = 0;
    private detailblks:Map<string,number> = new Map<string,number>();
    private masterblks:Map<string,boolean> = new Map<string,boolean>();


    constructor(private md:MasterDetail, private links:Map<string,dependencies>, block:BlockImpl, col?:string)
    {
        this.root$ = block;
        this.findblocks(block.alias,col);
    }


    public get root() : BlockImpl
    {
        return(this.root$);
    }


    private findblocks(block:string, col:string) : void
    {
        let dep:dependencies = this.links.get(block);

        if (dep.details != null)
        {
            this.masterblks.set(block,false);

            dep.details.forEach((det) =>
            {
                if (col == null || det.mkey.partof(col))
                {
                    this.waitfor(det.block);
                    this.findblocks(det.block.alias,null);
                }
            });
        }
    }


    public waitfor(block:BlockImpl) : void
    {
        this.detailblks.set(block.alias,0);
    }


    public ready(block:BlockImpl) : void
    {
        this.masterblks.set(block.alias,true);
        let dep:dependencies = this.links.get(block.alias);

        if (dep.details != null) this.execute(dep);
        else                     this.state(block,1);
    }


    public done(block:BlockImpl) : void
    {
        this.finished++;
        this.state(block,2);

        if (this.finished == this.detailblks.size)
            this.md.finished();
    }


    public failed(block:BlockImpl) : void
    {
        console.log("remove "+block.alias+" state: "+this.detailblks.get(block.alias));

        if (this.detailblks.get(block.alias) == 0)
        {
            this.detailblks.delete(block.alias);
            let dep:dependencies = this.links.get(block.alias);

            if (dep.details != null)
            {
                dep.details.forEach((det) =>
                {this.failed(det.block);});
            }
        }
        else this.finished++;

        console.log("after remove, finished: "+this.finished+" size: "+this.detailblks.size)
        if (this.finished == this.detailblks.size)
            this.md.finished();
    }


    private async execute(dep:dependencies)
    {
        if (dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
            {
                if (this.isready(dep.details[i].block))
                {
                    dep.details[i].block.executeqry();
                    this.state(dep.details[i].block,1);
                }
            }
        }
    }


    private isready(block:BlockImpl) : boolean
    {
        let ready:boolean = true;
        let dep:dependencies = this.links.get(block.alias);

        if (dep.masters != null)
        {
            dep.masters.forEach((master) =>
            {
                let alias:string = master.block.alias;
                let ok:boolean = this.masterblks.get(alias);
                if (ok == null || !ok) ready = false;
            });
        }

        return(ready);
    }


    private state(block:BlockImpl,state:number) : void
    {
        if (!this.detailblks.has(block.alias))
            console.log("Block "+block.alias+" !!!!");

        if (this.detailblks.has(block.alias))
            this.detailblks.set(block.alias,state);
    }
}