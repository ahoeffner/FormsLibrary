export interface DropDownEntry
{
    name:string;
    title?:string;
    action?:string;
    options?:DropDownEntry[];
}