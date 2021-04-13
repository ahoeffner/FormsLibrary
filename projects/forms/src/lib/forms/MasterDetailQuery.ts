import { BlockImpl } from "../blocks/BlockImpl";
import { dependencies, MasterDetail } from "./MasterDetail";


export class MasterDetailQuery
{
    private done:number = 0;
    private root$:BlockImpl;
    private masterblks:Map<string,boolean> = new Map<string,boolean>();
    private detailblks:Map<string,boolean> = new Map<string,boolean>();


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
                    this.findblocks(det.block.alias,null);
                    this.detailblks.set(det.block.alias,false);
                }
            });
        }
    }


    public ready(block:BlockImpl, record:number) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        this.md.bindkeys(block,record,dep);
        this.masterblks.set(block.alias,true);

        this.execute(dep);
    }


    private async execute(dep:dependencies)
    {
        if (dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
            {
                if (this.isready(dep.details[i].block))
                {
                    let last:boolean = this.done == this.detailblks.size - 1;

                    if (!last) dep.details[i].block.executeqry();
                    else await dep.details[i].block.executeqry();

                    this.detailblks.set(dep.details[i].block.alias,true);

                    if (++this.done == this.detailblks.size)
                        this.md.done();
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
}