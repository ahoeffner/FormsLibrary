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

    undo:string;
    paste:string;

    zoom:string;
    close:string;
    listval:string;

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

    pageup:string;
    pagedown:string;

    clearform:string;
    clearblock:string;

    enterquery:string;
    executequery:string;

    map:string;
}

export enum keymap
{
    enter,
    escape,

    undo,
    paste,

    close,

    listval,

    delete,
    dublicate,
    insertafter,
    insertbefore,

    commit,
    rollback,

    connect,
    disconnect,

    nextfield,
    prevfield,

    nextblock,
    prevblock,

    nextrecord,
    prevrecord,

    pageup,
    pagedown,

    clearform,
    clearblock,

    enterquery,
    executequery,

    zoom
}


export class KeyMapper
{
    private static keys:Map<string,keymap> = new Map<string,keymap>();


    public static index(map:KeyMap) : void
    {
        Object.keys(map).forEach((key) =>
        {
            let val:string = map[key];
            let km:keymap = keymap[key];
            KeyMapper.keys.set(val,km);
        });
    }


    public static keymap(key:string) : keymap
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