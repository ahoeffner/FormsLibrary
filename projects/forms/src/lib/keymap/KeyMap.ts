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
}

export class keymap
{
    public static enter:string = null;
    public static escape:string = null;

    public static listval:string = null;

    public static delete:string = null;
    public static dublicate:string = null;
    public static insertafter:string = null;
    public static insertbefore:string = null;

    public static commit:string = null;
    public static rollback:string = null;

    public static connect:string = null;
    public static disconnect:string = null;

    public static nextfield:string = null;
    public static prevfield:string = null;

    public static nextblock:string = null;
    public static prevblock:string = null;

    public static nextrecord:string = null;
    public static prevrecord:string = null;

    public static pageup:string = null;
    public static pagedown:string = null;

    public static clearform:string = null;
    public static clearblock:string = null;

    public static enterquery:string = null;
    public static executequery:string = null;
}


export class KeyMapper
{
    private static keys:Map<string,string> = new Map<string,string>();
    private static names:Map<string,string> = new Map<string,string>();


    public static index(map:KeyMap) : void
    {
        Object.keys(map).forEach((key) =>
        {
            let val:string = map[key];
            KeyMapper.keys.set(key,val);
            KeyMapper.names.set(val,key);
        });

        keymap.enter = map.enter;
        keymap.escape = map.escape;

        keymap.delete = map.delete;
        keymap.dublicate = map.dublicate;
        keymap.insertafter = map.insertafter;
        keymap.insertbefore = map.insertbefore;

        keymap.commit = map.commit;
        keymap.rollback = map.rollback;

        keymap.connect = map.connect;
        keymap.disconnect = map.disconnect;

        keymap.nextfield = map.nextfield;
        keymap.prevfield = map.prevfield;

        keymap.nextblock = map.nextblock;
        keymap.prevblock = map.prevblock;

        keymap.nextrecord = map.nextrecord;
        keymap.prevrecord = map.prevrecord;

        keymap.pageup = map.pageup;
        keymap.pagedown = map.pagedown;

        keymap.clearform = map.clearform;
        keymap.clearblock = map.clearblock;

        keymap.enterquery = map.enterquery;
        keymap.executequery = map.executequery;
    }


    public static key(key:string) : string
    {
        return(KeyMapper.keys.get(key));
    }


    public static keyname(key:string) : string
    {
        return(KeyMapper.names.get(key));
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


    public static ismap(key:string) : boolean
    {
        let pos:number = key.indexOf(":");

        if (pos > 0 && key.length-pos-1 == 4)
            return(true);

        return(false);
    }
}