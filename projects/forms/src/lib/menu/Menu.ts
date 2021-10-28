import { MenuEntry } from './MenuEntry';
import { MenuHandler } from './MenuHandler';


export interface Menu
{
    getHandler() : MenuHandler;
    getEntries() : MenuEntry[];
}