export interface Listener
{
    (field:string, row:number, type:string, value:any, key?:string);
}