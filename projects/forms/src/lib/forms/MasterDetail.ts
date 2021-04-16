import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { Field } from "../input/Field";
import { BlockImpl } from "../blocks/BlockImpl";
import { Statement } from "../database/Statement";
import { Condition } from "../database/Condition";
import { BindValue } from "../database/BindValue";
import { MasterDetailQuery } from "./MasterDetailQuery";
import { JOINDefinition } from "../annotations/JOINDefinitions";


interface waiting
{
    record:number;
    block:BlockImpl;
}


interface subquery
{
    sql:string;
    mtab:string;
    mcols:string[],
    dcols:string[],
    subs:subquery[];
    binds:BindValue[]
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
    private master$:BlockImpl = null;
    private query:MasterDetailQuery = null;
    private waiting:waiting = {block: null, record: null};
    private blocks:Map<string,BlockImpl> = new Map<string,BlockImpl>();
    private links:Map<string,dependencies> = new Map<string,dependencies>();
    private defined:Map<string,Map<string,Key>> = new Map<string,Map<string,Key>>();


    constructor(form:FormImpl)
    {
        this.form = form;
    }


    public get master() : BlockImpl
    {
        return(this.master$);
    }


    public set master(block:BlockImpl)
    {
        this.master$ = block;
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


    public enterquery(block:BlockImpl) : void
    {
        this.master$ = block;
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
            dep.details.forEach((det) => det.block.enterqry());
    }


    // Build subquery from details
    public getDetailQuery() : void
    {
        let block:BlockImpl = this.master$;
        this.master$ = null;

        if (block == null) return;
        let dep:dependencies = this.links.get(block.alias);

        let sub:subquery =
        {
            sql: null,
            subs: [],
            mcols: [],
            dcols: [],
            binds: [],
            mtab: null
        };

        if (dep != null && dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
                sub.subs.push(this.subquery(dep.details[i]));
        }

        this.buildsubquery(sub);

        console.log(sub.sql);
    }


    private subquery(detail:any) : subquery
    {
        let sub:subquery =
        {
            sql: null,
            subs: [],
            mcols: [],
            dcols: [],
            binds: [],
            mtab: null
        };

        let mkey:Key = detail.dkey;
        let dkey:Key = detail.dkey;
        let block:BlockImpl = detail.block;

        if (!block.querymode)
            return(sub);

        let fields:Field[] = block.records[0].fields;
        let stmt:Statement = block.data.parseQuery([],fields);

        sub.mcols = mkey.columns(),
        sub.dcols = dkey.columns(),
        sub.mtab = block.data?.table?.name;

        console.log("sub table: "+sub.mtab+" masters: "+sub.mcols+" details: "+sub.dcols)

        let cond:Condition = stmt.getCondition();

        if (cond)
        {
            stmt.order = null;
            stmt.columns = dkey.columns();

            sub.sql = stmt.build().sql;
            sub.binds = cond.bindvalues();
        }

        block.cancelqry();

        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
                sub.subs.push(this.subquery(dep.details[i]));
        }

        return(sub);
    }


    private buildsubquery(sub:subquery)
    {
        let children:boolean = false;

        for (let i = 0; i < sub.subs.length; i++)
        {
            this.buildsubquery(sub.subs[i]);
            if (sub.subs[i].sql != null) children = true;
        }

        let sql:string = "";

        if (children)
        {
            if (sub.sql != null) sub.sql += " and ("+sub.dcols+") in ";
            else sub.sql = " and select "+sub.dcols+" from "+sub.mtab+" where ";

            sql += "(";

            for (let i = 0; i < sub.subs.length; i++)
            {
                if (sql.length > 1)
                    sql += " and ";

                sql += sub.subs[i].sql;
                sub.subs[i].binds.forEach((bind) => {sub.binds.push(bind)});
            }

            sql += ")";
        }

        if (sub.mtab == null)
        {
            if (sql.length > 2)
                sub.sql = "("+sub.mcols+") in " +sql;
        }
        else
        {
            sub.sql += sql;
        }
    }


    public querydetails(block:BlockImpl, record?:number, init?:boolean) : void
    {
        if (init == null) init = false;
        if (record == null) record = 0;

        if (init && this.query != null)
        {
            console.log("waiting for <"+this.waiting.block?.alias+">")
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