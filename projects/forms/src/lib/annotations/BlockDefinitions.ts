import { BlockDefinition } from './BlockDefinition';


export class BlockDefinitions
{
    private static blocks:Map<string,any[]> =
        new Map<string,BlockDefinition[]>();


    public static setBlock(form:string, def:any) : void
    {
        let blocks:BlockDefinition[] = BlockDefinitions.blocks.get(form);

        if  (blocks == null)
        {
            blocks = [];
            BlockDefinitions.blocks.set(form.toLowerCase(),blocks);
        }

        blocks.unshift(def);
    }


    public static getBlocks(form:string) : BlockDefinition[]
    {
        return(BlockDefinitions.blocks.get(form.toLowerCase()));
    }
}