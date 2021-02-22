import { Form } from '../forms/Form';
import { MenuEntry } from './MenuEntry';
import { MenuHandler } from './MenuHandler';


export interface Menu
{
    activate() : void;
    deactivate() : void;
    setForm(form:Form) : void;
    getHandler() : MenuHandler;
    getEntries() : MenuEntry[];
}