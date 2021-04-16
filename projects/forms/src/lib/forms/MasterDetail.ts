import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { Field } from "../input/Field";
import { BlockImpl } from "../blocks/BlockImpl";
import { Condition } from "../database/Condition";
import { BindValue } from "../database/BindValue";
import { SQL, Statement } from "../database/Statement";
import { MasterDetailQuery } from "./MasterDetailQuery";
import { JOINDefinition } from "../annotations/JOINDefinitions";


interface waiting
{
    record:number;
    block:BlockImpl;
}


interface subquery
{
    lev:number;
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
            lev: 0,
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
                this.subquery(sub,dep.details[i]);
        }

        let subq:SQL = null;
        this.buildsubquery(sub);

        if (sub.sql.length > 0)
        {
            console.log("sql: "+sub.sql)
            console.log("bind: "+sub.binds.length);
            //subq = {sql: sub.sql, bindvalues: sub.binds};
        }
    }


    private subquery(parent:subquery,detail:any) : void
    {
        let mkey:Key = detail.dkey;
        let dkey:Key = detail.dkey;
        let block:BlockImpl = detail.block;

        if (block.querymode)
        {
            let sub:subquery =
            {
                sql: null,
                subs: [],
                binds: [],
                lev: +parent.lev + 1,
                mcols: mkey.columns(),
                dcols: dkey.columns(),
                mtab: block.data?.table?.name
            };

            parent.subs.push(sub);

            let fields:Field[] = block.records[0].fields;
            let stmt:Statement = block.data.parseQuery([],fields);

            block.cancelqry();

            let cond:Condition = stmt.getCondition();

            if (cond)
            {
                stmt.order = null;
                stmt.columns = dkey.columns();

                sub.sql = stmt.build().sql;
                sub.binds = cond.bindvalues();
            }

            let dep:dependencies = this.links.get(block.alias);

            if (dep != null && dep.details != null)
            {
                for (let i = 0; i < dep.details.length; i++)
                    this.subquery(sub,dep.details[i]);
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
            sql += "(";

            for (let i = 0; i < sub.subs.length; i++)
            {
                if (sub.subs[i].sql != null && sub.subs[i].sql.length > 0)
                {
                    if (and) sql += " and ";
                    if (where) sql += " where ";

                    sql += "("+sub.subs[i].mcols+") in (";
                    sql += sub.subs[i].sql;
                    sql += ")";

                    sub.subs[i].binds.forEach((bind) => {sub.binds.push(bind)});

                    and = true;
                    where = false;
                }
            }

            sql += ")";
        }

        if (sub.sql == null) sub.sql = sql;
        else                 sub.sql += sql;
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