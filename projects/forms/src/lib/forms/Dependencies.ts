import { Key } from "../blocks/Key";
import { FormImpl } from "./FormImpl";
import { BlockImpl } from "../blocks/BlockImpl";
import { JOINDefinition } from "../annotations/JOINDefinitions";
import { join } from "../annotations/join";


export class Dependencies
{
    private form:FormImpl;
    private blocks:Map<string,BlockImpl> = new Map<string,BlockImpl>();
    private defined:Map<string,Map<string,Key>> = new Map<string,Map<string,Key>>();


    constructor(form:FormImpl)
    {
        this.form = form;
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
                console.log("keys on "+join.master.alias+" => "+keys);
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
                    console.log("Join "+master.alias+" to "+detail.alias);

                    console.log("Master "+mkey.get("location_id"));
                    console.log("Master "+dkey.get("location_id"));

                    console.log("Test1 "+mkey.get("location_id"));
                    mkey.set("location_id",17);
                    console.log("Test2 "+mkey.get("location_id"));
                }
            }
        });
    }
}