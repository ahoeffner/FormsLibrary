import { BlockImpl } from "../blocks/BlockImpl";
import { dependencies, MasterDetail } from "./MasterDetail";


export class MasterDetailQuery
{
    private done:number = 0;
    public blocks:Map<string,boolean> = new Map<string,boolean>();


    constructor(private md:MasterDetail, private links:Map<string,dependencies>, block:BlockImpl, col?:string)
    {
        this.details(block.alias,col);
        if (col == null) this.blocks.set(block.alias,true);
    }


    private details(block:string, col:string) : void
    {
        let dep:dependencies = this.links.get(block);

        if (dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                if (col == null || det.mkey.partof(col))
                {
                    this.details(det.block.alias,null);
                    this.blocks.set(det.block.alias,false);
                }
            });
        }
    }


    public ready(block:BlockImpl, record:number) : void
    {
        console.log("query ready "+block.alias);
        let dep:dependencies = this.links.get(block.alias);

        this.md.bindkeys(block,record,dep);
        this.blocks.set(block.alias,true);

        this.execute(dep);
    }


    private execute(dep:dependencies) : void
    {
        if (dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                if (this.isready(det.block))
                {
                    this.done++;
                    det.block.executeqry();
                }
            });
        }

        if (this.done == this.blocks.size)
            this.md.done();
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
                let ok:boolean = this.blocks.get(alias);
                if (ok == null || !ok) ready = false;
            });
        }

        return(ready);
    }
}