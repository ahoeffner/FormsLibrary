import { Popup } from "../popup/Popup";
import { Builder } from "../utils/Builder";
import { FormArea } from "../forms/FormArea";
import { PopupImpl } from "../popup/PopupImpl";
import { FormsControl } from "../forms/FormsControl";
import { FormsDefinition } from "../forms/FormsDefinition";
import { Implementations } from "../utils/Implementations";


export class ApplicationImpl
{
    private title:string = null;
    private ready:boolean = false;
    private formsctl:FormsControl;


    public getTitle() : string
    {
        return(this.title);
    }

    public setTitle(title:string)
    {
        this.title = title;
        document.title = this.title;
    }


    constructor(private builder:Builder)
    {
        this.formsctl = new FormsControl(this,builder);
    }


    public setFormsDefinitions(forms:FormsDefinition[]) : void
    {
        this.formsctl.setFormsDefinitions(forms);
        let form:string = window.location.pathname;
        if (form.length > 1) this.showform(form.substring(1));
    }


    public setFormArea(form:FormArea)
    {
        this.formsctl.setFormArea(form);
        this.ready = true;
    }


    public showform(form:string)
    {
        if (this.ready) this.formsctl.showform(form);
        else setTimeout(() => {this.showform(form);},10);
    }


    public callform(form:string)
    {
        if (this.ready) this.formsctl.callform(form);
        else setTimeout(() => {this.callform(form);},10);
    }


    public closeform(form:string)
    {
        if (this.ready) this.formsctl.closeform(form);
        else setTimeout(() => {this.closeform(form);},10);
    }


    public showpopup(popup:Popup) : void
    {
        let impl:PopupImpl = Implementations.get<PopupImpl>(popup);
        impl.display(this.builder);
    }
}