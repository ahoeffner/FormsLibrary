export interface Key
{
    code:number;
    alt?:boolean;
    ctrl?:boolean;
    meta?:boolean;
    shift?:boolean;
}

export interface KeyMap
{
    enter:string;
    escape:string;

    delete:string;
    dublicate:string;
    insertafter:string;
    insertbefore:string;

    commit:string;
    rollback:string;

    connect:string;
    disconnect:string;

    nextfield:string;
    prevfield:string;
    nextblock:string;
    prevblock:string;
    nextrecord:string;
    prevrecord:string;

    clearform:string;
    clearblock:string;

    enterquery:string;
    executequery:string;
}

export class KeyMapper
{
    public static map(key:Key) : string
    {
        let sig:string = key.code+":";

        sig += key.shift ? "t" : "f";
        sig += key.ctrl  ? "t" : "f";
        sig += key.alt   ? "t" : "f";
        sig += key.meta  ? "t" : "f";

        return(sig);
    }
}