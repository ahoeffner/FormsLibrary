import { FormImpl } from "./FormImpl";
import { FormUtil } from "./FormUtil";
import { Utils } from "../utils/Utils";
import { InstanceID } from "./InstanceID";
import { ComponentRef } from "@angular/core";
import { FormInstance } from "./FormInstance";
import { FormsControl } from "./FormsControl";
import { WindowOptions } from "./WindowOptions";


export class InstanceControl
{
    private utils:Utils = new Utils();
    private forms:Map<string,FormInstance>;
    private futil:FormUtil = new FormUtil();

    constructor(private ctrl:FormsControl) {}


    public setFormsDefinitions(forms:Map<string,FormInstance>)
    {
        this.forms = forms;
    }


    public getNewInstance(form:any, modal?:WindowOptions) : InstanceID
    {
        let name:string = this.utils.getName(form);
        if (name == null) return(null);

        let def:FormInstance = this.forms.get(name);
        if (def == null) return(null);

        let ref:ComponentRef<any> = this.ctrl.createForm(def.component);
        if (ref == null) return(null);

        let impl:FormImpl = ref.instance["impl"];

        if (modal == null) modal = def.windowdef;
        modal = this.futil.complete(modal,true);

        let id:InstanceID =
        {
            ref: ref,
            impl: impl,
            name: def.name,
            modalopts: modal
        }

        impl.setInstanceID(id);

        return(id);
    }


    public getInstance(id:InstanceID) : FormInstance
    {
        let def:FormInstance = this.forms.get(id.name);
        let instance:FormInstance = this.futil.clone(def);
        if (id.ref == null) id.ref = this.ctrl.createForm(def.component);

        instance.formref = id.ref;
        instance.windowopts = id.modalopts;

        return(instance);
    }


    public closeInstance(id:InstanceID, destroy:boolean) : void
    {
        let inst:FormInstance = this.getInstance(id);

        if (destroy)
        {
            inst.formref.destroy();
            inst.windowopts = null;
            inst.formref = null;
        }
    }
}