import { Utils } from '../utils/Utils';
import { BlockDefinitions } from './BlockDefinitions';
import { BlockDefinition } from '../blocks/BlockDefinition';


export const BLOCK = (alias:string, component?:any) =>
{
    function def(form:any, prop?:string)
    {
        let utils:Utils = new Utils();
        let fname:string = utils.getName(form);

        let def:BlockDefinition =
        {
            prop: prop,
            alias: alias,
            component: component
        }

        let cn:string = "";
        if (component != null) cn = component.name;
        console.log("BLOCK form: "+fname+" comp: "+cn+" alias: "+alias+" prop: "+prop);
        BlockDefinitions.setBlock(fname,def);
    }
    return(def);
}