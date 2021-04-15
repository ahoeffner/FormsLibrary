import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { BlockImpl } from "../blocks/BlockImpl";
import { MasterDetailQuery } from "./MasterDetailQuery";
import { JOINDefinition } from "../annotations/JOINDefinitions";
import { Statement } from "../database/Statement";
import { Field } from "../input/Field";


interface waiting
{
    record:number;
    block:BlockImpl;
}


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
    private waiting:waiting = {block: null, record: null};
    private blocks:Map<string,BlockImpl> = new Map<string,BlockImpl>();
    private links:Map<string,dependencies> = new Map<string,dependencies>();
    private defined:Map<string,Map<string,Key>> = new Map<string,Map<string,Key>>();


    constructor(form:FormImpl)
    {
        this.form = form;
    }


    public enterquery(block:BlockImpl) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
            dep.details.forEach((det) => det.block.enterqry());
    }


    public cleardetails(block:BlockImpl) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
            dep.details.forEach((det) => this.clear(det.block));
    }


    private clear(block:BlockImpl) : void
    {
        block.clear();

        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
            dep.details.forEach((det) => this.clear(det.block))
    }


    public async validatedetails(block:BlockImpl) : Promise<boolean>
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
            {
                if (!await this.validate(dep.details[i].block))
                    return(false);
            }
        }

        return(true);
    }


    private async validate(block:BlockImpl) : Promise<boolean>
    {
        block.clear();

        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
            {
                if (!await this.validate(dep.details[i].block))
                    return(false);

                if (!await dep.details[i].block.validate())
                    return(false);
            }
        }

        return(true);
    }


    public sync(block:BlockImpl, record:number, col:string) : void
    {
        if (col == null) return;
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null)
        {
            if (!dep.keycols.has(col)) return;
            this.query = new MasterDetailQuery(this,this.links,block,col);
            this.querydetails(block,record);
        }
    }


    // Build subquery from details
    public getDetailQuery(block:BlockImpl) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                console.log("mkey: "+det.mkey.columns())
                console.log("dkey: "+det.dkey.columns())
                this.subquery(det.block);
            });
        }
    }


    private subquery(block:BlockImpl)
    {
        if (!block.querymode) return(null);
        let fields:Field[] = block.records[0].fields;
        let stmt:Statement = block.data.parseQuery([],fields);

        if (stmt.condition)
            console.log(block.alias+" "+stmt.condition.toString);
    }


    public querydetails(block:BlockImpl, record?:number, init?:boolean) : void
    {
        if (init == null) init = false;
        if (record == null) record = 0;

        if (init && this.query != null)
        {
            this.waiting.block = block;
            this.waiting.record = record;
            return;
        }

        let dep:dependencies = this.links.get(block.alias);

        if (dep != null)
        {
            if (this.query == null)
                this.query = new MasterDetailQuery(this,this.links,block);

            this.query.ready(block,record);
        }
    }


    public getKeys(block:BlockImpl) : Key[]
    {
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
        if (dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                det.mkey.columns().forEach((col) =>
                {det.dkey.set(col,block.data.getValue(record,col));});
            });
        }
    }


    public done() : void
    {
        let record:number = 0;
        let block:BlockImpl = null;

        if (this.waiting.block != null)
        {
            block = this.waiting.block;
            record = this.waiting.record;

            this.waiting.block = null;

            this.query = new MasterDetailQuery(this,this.links,block);
            this.query.ready(block,record);
        }
        else this.query = null;
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