export interface Key
{
    code:number;
    name?:string;
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
    private static keys:Map<string,string> = new Map<string,string>();


    public static index(map:KeyMap) : void
    {
        Object.keys(map).forEach((key) =>
        {
            let val:string = map[key];
            KeyMapper.keys.set(val,key);
        });
    }


    public static key(key:string) : string
    {
        return(KeyMapper.keys.get(key));
    }


    public static map(key:Key) : string
    {
        let sig:string = key.code+":";

        sig += key.shift ? "t" : "f";
        sig += key.ctrl  ? "t" : "f";
        sig += key.alt   ? "t" : "f";
        sig += key.meta  ? "t" : "f";

        return(sig);
    }


    public static parse(key:string) : Key
    {
        let pos:number = key.indexOf(":");
        let shf:boolean = key[pos+1] == 't';
        let ctl:boolean = key[pos+2] == 't';
        let alt:boolean = key[pos+3] == 't';
        let mta:boolean = key[pos+4] == 't';
        let code:number = +key.substring(0,pos);
        return({code: code, shift: shf, ctrl: ctl, alt: alt, meta: mta});
    }
}