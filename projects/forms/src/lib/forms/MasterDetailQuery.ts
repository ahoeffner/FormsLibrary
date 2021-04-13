import { BlockImpl } from "../blocks/BlockImpl";
import { dependencies, MasterDetail } from "./MasterDetail";


export class MasterDetailQuery
{
    private done:number = 0;
    public blocks:Map<string,boolean> = new Map<string,boolean>();


    constructor(private md:MasterDetail, private links:Map<string,dependencies>, block:BlockImpl)
    {
        this.details(block.alias);
        this.blocks.set(block.alias,true);
    }


    private details(block:string) : void
    {
        let dep:dependencies = this.links.get(block);

        if (dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                this.details(det.block.alias);
                this.blocks.set(det.block.alias,false);
            });
        }
    }


    public ready(block:BlockImpl, record:number) : void
    {
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

        this.blocks.forEach((status,blk) => {console.log(blk+" "+status)});
        console.log("blocks: "+this.blocks.size+" done: "+this.done);
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
                if (!ok && ok != null) ready = false;
            });
        }

        return(ready);
    }
}