import { BlockDefinition } from '../blocks/BlockDefinition';


export class BlockDefinitions
{
    private static dalias:Map<string,string> = new Map<string,string>();
    private static blocks:Map<string,any[]> = new Map<string,BlockDefinition[]>();


    public static setBlockDefaultAlias(block:string, alias:string) : void
    {
        if (alias == null) alias = block;
        BlockDefinitions.dalias.set(block,alias);
    }


    public static getBlockDefaultAlias(alias:string) : string
    {
        alias = alias.toLowerCase();
        let bname:string = BlockDefinitions.dalias.get(alias);
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
}