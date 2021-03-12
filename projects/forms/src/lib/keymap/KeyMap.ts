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
    undoform:string;
    undoblock:string;
    undorecord:string;

    enter:string;
    escape:string;

    insert:string;
    delete:string;
    dublicate:string;

    commit:string;
    rollback:string;

    connect:string;
    disconnect:string;

    nextfield:string;
    prevfield:string;
    nextblock:string;
    prevblock:string;

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