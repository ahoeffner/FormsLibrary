import { MenuEntry } from './MenuEntry';


export interface Menu
{
    handler:any;
    entries:MenuEntry[];
}