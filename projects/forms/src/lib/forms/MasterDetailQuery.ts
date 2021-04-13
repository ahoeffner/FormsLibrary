import { BlockImpl } from "../blocks/BlockImpl";
import { dependencies, MasterDetail } from "./MasterDetail";


export class MasterDetailQuery
{
    private done:number = 0;
    private root$:BlockImpl;
    private detailblks:Map<string,boolean> = new Map<string,boolean>();


    constructor(private md:MasterDetail, private links:Map<string,dependencies>, block:BlockImpl, col?:string)
    {
        this.root$ = block;
        this.details(block.alias,col);
        this.detailblks.set(block.alias,true);
    }


    public get root() : BlockImpl
    {
        return(this.root$);
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
                    this.detailblks.set(det.block.alias,false);
                }
            });
        }
    }


    public ready(block:BlockImpl, record:number) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        this.md.bindkeys(block,record,dep);
        this.detailblks.set(block.alias,true);

        this.execute(dep);

        if (++this.done == this.detailblks.size)
            this.md.done();
    }


    private execute(dep:dependencies) : void
    {
        if (dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                if (this.isready(det.block))
                    det.block.executeqry();
            });
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
                let ok:boolean = this.detailblks.get(alias);
                if (ok == null || !ok) ready = false;
            });
        }

        return(ready);
    }
}