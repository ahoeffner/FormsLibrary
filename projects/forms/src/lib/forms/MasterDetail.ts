import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { Field } from "../input/Field";
import { Column } from "../database/Column";
import { Trigger } from "../events/Triggers";
import { BlockImpl } from "../blocks/BlockImpl";
import { BindValue } from "../database/BindValue";
import { MasterDetailQuery } from "./MasterDetailQuery";
import { SQLTriggerEvent } from "../events/TriggerEvent";
import { JOINDefinition } from "../annotations/JOINDefinitions";
import { bindvalue, SQL, Statement } from "../database/Statement";


interface subquery
{
    lev:number;
    sql:string;
    mtab:string;
    mcols:string[],
    dcols:string[],
    subs:subquery[];
    bindvalues:BindValue[]
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
    private waiting:BlockImpl = null;
    private query:MasterDetailQuery = null;
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


    public getRoot(block?:BlockImpl) : BlockImpl
    {
        if (block == null)
            block = Array.from(this.blocks)[0]["1"];

        let dep:dependencies = this.links.get(block.alias);

        while(dep != null && dep.masters != null && dep.masters.length > 0)
        {
            block = dep.masters[0].block;
            dep = this.links.get(block.alias);
        }

        return(block);
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


    public sync(block:BlockImpl, col:string) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null)
        {
            if (!dep.keycols.has(col)) return;

            this.master = block;
            this.query = new MasterDetailQuery(this,this.links,block,col);
            this.query.ready(block);
        }
    }


    public enterquery(block:BlockImpl) : void
    {
        this.master$ = block;
        this.enterdetailquery(block);
    }


    private enterdetailquery(block:BlockImpl) : void
    {
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                if (det.block.usage.query)
                    det.block.enterqry();
                    
                this.enterdetailquery(det.block);
            });
        }
    }


    public clearfilters(block:BlockImpl) : void
    {
        block.searchfilter = [];
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.details != null)
        {
            dep.details.forEach((det) =>
            {
                det.block.searchfilter = [];
                this.clearfilters(det.block);
            });
        }
    }


    // Build subquery from details
    public async getDetailQuery() : Promise<SQL>
    {
        let block:BlockImpl = this.master$;
        this.master$ = null;

        if (block == null) return(null);
        let dep:dependencies = this.links.get(block.alias);

        let sub:subquery =
        {
            lev: 0,
            sql: null,
            subs: [],
            mcols: [],
            dcols: [],
            bindvalues: [],
            mtab: null
        };

        if (dep != null && dep.details != null)
        {
            for (let i = 0; i < dep.details.length; i++)
                await this.subquery(sub,dep.details[i]);
        }

        let subq:SQL = null;
        this.buildsubquery(sub);

        if (sub.sql.length > 0)
        {
            let bindvals:bindvalue[] = [];

            sub.bindvalues.forEach((bindv) =>
            {
                bindvals.push
                ({
                    name: bindv.name,
                    type: Column[bindv.type].toLowerCase(),
                    value: bindv.value
                });
            });

            subq = {sql: sub.sql, bindvalues: bindvals};
        }

        return(subq)
    }


    private async subquery(parent:subquery,detail:any)
    {
        let mkey:Key = detail.mkey;
        let dkey:Key = detail.dkey;
        let block:BlockImpl = detail.block;

        if (block.querymode)
        {
            let sub:subquery =
            {
                sql: null,
                subs: [],
                bindvalues: [],
                lev: +parent.lev + 1,
                mcols: mkey.columns(),
                dcols: dkey.columns(),
                mtab: block.data?.table?.name
            };

            parent.subs.push(sub);

            let fields:Field[] = block.records[0].fields;
            let stmt:Statement = block.data.parseQuery([],null,fields);

            let event:SQLTriggerEvent = new SQLTriggerEvent(block.alias,0,stmt);

            if (!await block.invokeTriggers(Trigger.PreQuery,event))
                return;

            block.cancelqry();

            if (block.searchfilter.length > 0)
            {
                stmt.order = null;
                stmt.columns = dkey.columns();

                sub.sql = stmt.build().sql;
                sub.bindvalues = stmt.getCondition().getAllBindvalues();
            }

            let dep:dependencies = this.links.get(block.alias);

            if (dep != null && dep.details != null)
            {
                for (let i = 0; i < dep.details.length; i++)
                    await this.subquery(sub,dep.details[i]);
            }
        }
    }


    private buildsubquery(sub:subquery)
    {
        let children:boolean = false;

        for (let i = 0; i < sub.subs.length; i++)
        {
            this.buildsubquery(sub.subs[i]);

            if (sub.subs[i].sql != null && sub.subs[i].sql.length > 0)
                children = true;
        }

        let sql:string = "";
        let and:boolean = false;
        let where:boolean = false;

        if (sub.sql != null) and = true;
        else if (children && sub.mtab != null)
        {
            where = true;
            sub.sql = "select "+sub.dcols+" from "+sub.mtab;
        }

        if (children)
        {
            for (let i = 0; i < sub.subs.length; i++)
            {
                if (sub.subs[i].sql != null && sub.subs[i].sql.length > 0)
                {
                    if (and) sql += " and ";
                    if (where) sql += " where ";

                    sql += "("+sub.subs[i].mcols+") in (";
                    sql += sub.subs[i].sql;
                    sql += ")";

                    sub.subs[i].bindvalues.forEach((bind) => {sub.bindvalues.push(bind)});

                    and = true;
                    where = false;
                }
            }
        }

        if (sub.sql == null) sub.sql = sql;
        else                 sub.sql += sql;
    }


    public querydetails(block:BlockImpl, init:boolean, ready:boolean) : void
    {
        if (init == null)
            init = false;

        if (init)
        {
            if (this.query != null)
            {
                this.waiting = block;
                return;
            }

            this.master = block;
            this.query = new MasterDetailQuery(this,this.links,block);
        }

        if (ready) this.query.ready(block);
        else       this.query.waitfor(block);
    }


    public done(block:BlockImpl,success:boolean)
    {
        if (success) this.query.done(block);
        else         this.query.failed(block);
    }


    public finished() : void
    {
        let block:BlockImpl = null;

        if (this.waiting != null)
        {
            block = this.waiting;

            this.waiting = null;

            this.query = new MasterDetailQuery(this,this.links,block);
            this.query.ready(block);
        }
        else
        {
            this.query = null;
            this.master = null;
        }
    }


    public getKeys(block:BlockImpl) : Key[]
    {
        let keys:Key[] = [];
        let dep:dependencies = this.links.get(block.alias);

        if (dep != null && dep.masters != null)
        {
            dep.masters.forEach((master) =>
            {
                let c:number = 0;
                let record:number = master.block.record;

                master.mkey.columns().forEach((col) =>
                {
                    let val:any = null;

                    if (record < master.block.datarows)
                        val = master.block.getValue(record,col);

                    master.dkey.set(c++,val);
                });

                keys.push(master.dkey);
            });
        }

        return(keys);
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