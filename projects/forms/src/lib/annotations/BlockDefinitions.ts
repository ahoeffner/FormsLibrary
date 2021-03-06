import { BlockDefinition } from '../blocks/BlockDefinition';


export class BlockDefinitions
{
    private static bdefault:Map<string,string> = new Map<string,string>();
    private static blocks:Map<string,any[]> = new Map<string,BlockDefinition[]>();


    public static setBlockDefaultAlias(block:string, alias:string) : void
    {
        BlockDefinitions.bdefault.set(alias.toLowerCase(),block);
    }


    public static getBlockName(alias:string) : string
    {
        return(BlockDefinitions.bdefault.get(alias.toLowerCase()));
    }


    public static setBlock(form:string, def:any) : void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks.get(form.toLowerCase());

        if  (blocks == null)
        {
            blocks = [];
            BlockDefinitions.blocks.set(form.toLowerCase(),blocks);
        }

        blocks.unshift(def);
    }


    public static getBlocks(form:string) : BlockDefinition[]
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks.get(form.toLowerCase());
        if (blocks == null) blocks = [];
        return(blocks);
    }
}