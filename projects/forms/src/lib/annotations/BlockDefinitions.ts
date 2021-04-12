import { KeyDefinition } from './KeyDefinition';
import { BlockDefinition } from '../blocks/BlockDefinition';
import { BlockImpl } from '../blocks/BlockImpl';


export class BlockDefinitions
{
    private static alias:Map<string,string> = new Map<string,string>();
    private static blocks:Map<string,any[]> = new Map<string,BlockDefinition[]>();
    private static keys:Map<string,KeyDefinition[]> = new Map<string,KeyDefinition[]>();


    public static setDefaultAlias(block:string, alias:string) : void
    {
        if (alias == null) alias = block;
        BlockDefinitions.alias.set(block,alias);
    }


    public static getDefaultAlias(alias:string) : string
    {
        alias = alias.toLowerCase();
        let bname:string = BlockDefinitions.alias.get(alias);
        if (bname == null) bname = alias;
        return(bname);
    }


    public static setBlock(form:string, def:BlockDefinition) : void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks.get(form.toLowerCase());

        if  (blocks == null)
        {
            blocks = [];
            BlockDefinitions.blocks.set(form.toLowerCase(),blocks);
        }

        if (def.prop != null) blocks.push(def);
        else                  blocks.unshift(def);
    }


    public static getBlocks(form:string) : BlockDefinition[]
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks.get(form.toLowerCase());
        if (blocks == null) blocks = [];
        return(blocks);
    }


    public static setKey(block:string, def:KeyDefinition) : void
    {
        let keys:KeyDefinition[] = BlockDefinitions.keys.get(block.toLowerCase());

        if  (keys == null)
        {
            keys = [];
            BlockDefinitions.keys.set(block.toLowerCase(),keys);
        }

        keys.unshift(def);
    }


    public static getKeys(block:string) : KeyDefinition[]
    {
        let keys:KeyDefinition[] = BlockDefinitions.keys.get(block.toLowerCase());
        if (keys == null) keys = [];
        return(keys);
    }
}