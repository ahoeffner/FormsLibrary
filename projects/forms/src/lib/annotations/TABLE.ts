import { Utils } from '../utils/Utils';

export const table = (name:string) =>
{
    function def(comp:any)
    {
        let utils:Utils = new Utils();
        let cname:string = utils.getName(comp);
        let ctype:string = utils.getType(comp);

        if (ctype != "Block")
        {
            window.alert("@TABLE("+name+") can only be used on blocks");
            return;
        }

    }
    return(def);
}