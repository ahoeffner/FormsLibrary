export interface MenuEntry
{
    name:string;
    title?:string;
    action?:string;
    options?:MenuEntry[];
}