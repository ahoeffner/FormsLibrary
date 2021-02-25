export class BlockDefinitions
{
    private static blocks:Map<string,any[]> =
        new Map<string,any[]>();


    public static setBlock(form:string, def:any) : void
    {
        let blocks:any[] = BlockDefinitions.blocks.get(form);

        if  (blocks == null)
        {
            blocks = [];
            BlockDefinitions.blocks.set(form,blocks);
        }

        blocks.push(def);
    }


    public static getBlocks(form:string) : any[]
    {
        return(BlockDefinitions.blocks.get(form));
    }
}