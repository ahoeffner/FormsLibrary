import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { BlockImpl } from "../blocks/BlockImpl";
import { MasterDetailQuery } from "./MasterDetailQuery";
import { JOINDefinition } from "../annotations/JOINDefinitions";


export interface dependencies
{
    keycols:Set<string>;
    masters?:{block:BlockImpl, mkey:Key, dkey:Key}[];
    details?:{block:BlockImpl, mkey:Key, dkey:Key}[];
}


export class MasterDetail
{
    private form:FormImpl = null;
    private query:MasterDetailQuery = null;
    private blocks:Map<string,BlockImpl> = new Map<string,BlockImpl>();
    private links:Map<string,dependencies> = new Map<string,dependencies>();
    private defined:Map<string,Map<string,Key>> = new Map<string,Map<string,Key>>();


    constructor(form:FormImpl)
    {
        this.form = form;
    }


    public sync(block:BlockImpl, record:number, col:string) : void
    {
        if (col == null) return;
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null)
        {
            this.query = new MasterDetailQuery(this,this.links,block,col);
            this.querydetails(block,record);
        }
    }


    public async querydetails(block:BlockImpl, record?:number)
    {
        if (record == null) record = 0;
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            if (this.query == null)
                this.query = new MasterDetailQuery(this,this.links,block);

            this.query.ready(block,record);
        }
    }


    public getKeys(block:BlockImpl) : Key[]
    {
        console.log("getKeys "+block.alias+" "+this.query)
        if (this.query == null)
            return([]);

        let keys:Key[] = [];
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.masters != null)
        {
            dep.masters.forEach((master) =>
            {keys.push(master.dkey);});
        }

        return(keys);
    }


    // Copy values to detail keys
    public bindkeys(block:BlockImpl, record:number, dep:dependencies) : void
    {
        dep.details.forEach((det) =>
        {
            det.mkey.columns().forEach((col) =>
            {det.dkey.set(col,block.data.getValue(record,col));});
        });
    }


    public done() : void
    {
        console.log("done");
        this.query = null;
    }


    public addBlock(block:BlockImpl) : void
    {
        this.blocks.set(block.alias,block);
    }


    public addKeys(block:BlockImpl, keys:Map<string,Key>) : void
    {
        this.defined.set(block.alias,keys);
    }


    public addJoins(joins:JOINDefinition[]) : void
    {
        if (joins == null) return;

        joins.forEach((join) =>
        {
            let skip:boolean = false;

            let master:BlockImpl = this.blocks.get(join.master.alias);
            let detail:BlockImpl = this.blocks.get(join.detail.alias);

            if (master == null)
            {
                skip = true;
                console.log("Master block "+join.master.alias+" in join on form "+this.form.name+" does not exist");
            }

            if (detail == null)
            {
                skip = true;
                console.log("Detail block "+join.detail.alias+" in join on form "+this.form.name+" does not exist");
            }

            if (!skip)
            {
                let keys:Map<string,Key> = null;

                keys = this.defined.get(join.master.alias);
                let mkey:Key = keys?.get(join.master.key);

                keys = this.defined.get(join.detail.alias);
                let dkey:Key = keys?.get(join.detail.key);

                if (mkey == null)
                {
                    skip = true;
                    console.log("Join on form "+this.form.name+". Cannot find key "+join.master.key+" on block "+join.master.alias);
                }

                if (dkey == null)
                {
                    skip = true;
                    console.log("Join on form "+this.form.name+". Cannot find key "+join.detail.key+" on block "+join.detail.alias);
                }

                if (!skip)
                {
                    let mdep:dependencies = this.links.get(master.alias);

                    if (mdep == null)
                    {
                        mdep = {keycols: new Set<string>()};
                        this.links.set(master.alias,mdep);
                    }

                    if (mdep.details == null)
                        mdep.details = [];

                    dkey.columns().forEach((col) => {mdep.keycols.add(col)});
                    mdep.details.push({block: detail, mkey: mkey, dkey: dkey});

                    let ddep:dependencies = this.links.get(detail.alias);

                    if (ddep == null)
                    {
                        ddep = {keycols: new Set<string>()};
                        this.links.set(detail.alias,ddep);
                    }

                    if (ddep.masters == null)
                        ddep.masters = [];

                    ddep.masters.push({block: master, mkey: mkey, dkey: dkey});
                }
            }
        });
    }
}