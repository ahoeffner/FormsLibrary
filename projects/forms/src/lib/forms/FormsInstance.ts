import { FormImpl } from "./FormImpl";
import { Utils } from "../utils/Utils";
import { ComponentRef } from "@angular/core";
import { FormsControl } from "./FormsControl";
import { Protected } from '../utils/Protected';
import { ApplicationImpl } from "../application/ApplicationImpl";
import { FormInstance, InstanceID, ModalOptions, FormUtil } from "./FormsDefinition";


export class FormsInstance
{
    private utils:Utils = new Utils();
    private futil:FormUtil = new FormUtil();


    constructor(private ctrl:FormsControl, private forms:Map<string,FormInstance>)
    {
    }


    public getNewInstance(form:any, modal?:ModalOptions) : InstanceID
    {
        let name:string = this.utils.getName(form);
        if (name == null) return(null);

        let def:FormInstance = this.forms.get(name);
        if (def == null) return(null);

        let ref:ComponentRef<any> = this.ctrl.createForm(def.component);
        if (ref == null) return(null);

        let id:InstanceID =
        {
            ref: ref,
            name: def.name,
            modalopts: modal,
            form: ref.instance
        }

        let impl:FormImpl = Protected.get(ref.instance);
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


    public closeInstance<C>(id:InstanceID, destroy:boolean) : C
    {
        let clazz:any = null;
        if (id.ref != null) clazz = id.ref.instance;

        let inst:FormInstance = this.getInstance(id);
        this.ctrl.close(inst,destroy);

        if (destroy) inst.ref = null;
        return(clazz as C);
    }
}