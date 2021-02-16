import { BlockProperty } from '../blocks/BlockProperty';


export class Definitions
{
    private static blocks:Map<string,BlockProperty[]> =
        new Map<string,BlockProperty[]>();


    public static setBlock(form:string, def:BlockProperty) : void
    {
        let blocks:BlockProperty[] = Definitions.blocks.get(form);

        if  (blocks == null)
        {
            blocks = [];
            Definitions.blocks.set(form,blocks);
        }

        blocks.push(def);
    }


    public static getBlocks(form:string) : BlockProperty[]
    {
        return(Definitions.blocks.get(form));
    }
}