import { FormImpl } from "./FormImpl";
import { Utils } from "../utils/Utils";
import { ComponentRef } from "@angular/core";
import { FormsControl } from "./FormsControl";
import { Protected } from '../utils/Protected';
import { FormInstance, InstanceID, ModalOptions, FormUtil } from "./FormsDefinition";


export class FormsInstance
{
    private utils:Utils = new Utils();
    private forms:Map<string,FormInstance>;
    private futil:FormUtil = new FormUtil();

    constructor(private ctrl:FormsControl) {}


    public setFormsDefinitions(forms:Map<string,FormInstance>)
    {
        this.forms = forms;
    }


    public getNewInstance(form:any, modal?:ModalOptions) : InstanceID
    {
        let name:string = this.utils.getName(form);
        if (name == null) return(null);

        let def:FormInstance = this.forms.get(name);
        if (def == null) return(null);

        let ref:ComponentRef<any> = this.ctrl.createForm(def.component);
        if (ref == null) return(null);

        let impl:FormImpl = Protected.get(ref.instance);

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

        instance.ref = id.ref;
        instance.modalopts = id.modalopts;

        return(instance);
    }


    public closeInstance(id:InstanceID, destroy:boolean) : void
    {
        let inst:FormInstance = this.getInstance(id);

        if (destroy)
        {
            inst.ref.destroy();
            inst.modalopts = null;
            inst.ref = null;
        }
    }
}