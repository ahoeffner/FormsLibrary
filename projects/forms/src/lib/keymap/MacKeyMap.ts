import { KeyCodes } from "./KeyCodes";
import { KeyMap, KeyMapper } from "./KeyMap";

export class MacKeyMap implements KeyMap
{
    undoform:string = KeyMapper.map({code: KeyCodes.escape, alt: true, shift:true, ctrl:true});
    undoblock:string = KeyMapper.map({code: KeyCodes.escape, shift:true, ctrl:true});
    undorecord:string = KeyMapper.map({code: KeyCodes.escape, shift:true, ctrl:true});

    enter:string = KeyMapper.map({code: KeyCodes.enter});
    escape:string = KeyMapper.map({code: KeyCodes.escape});

    insert:string = KeyMapper.map({code: 73, ctrl: true});
    delete:string = KeyMapper.map({code: 68, ctrl: true});
    dublicate:string;

    commit:string = KeyMapper.map({code: KeyCodes.enter, ctrl: true});
    rollback:string = KeyMapper.map({code: KeyCodes.escape, ctrl: true});

    connect:string;
    disconnect:string;

    nextfield:string = KeyMapper.map({code: KeyCodes.tab});
    prevfield:string = KeyMapper.map({code: KeyCodes.tab, shift: true});
    nextrecord:string = KeyMapper.map({code: KeyCodes.down, shift: false});
    prevrecord:string = KeyMapper.map({code: KeyCodes.up, shift: false});
    nextblock:string = KeyMapper.map({code: KeyCodes.down, shift: true});
    prevblock:string = KeyMapper.map({code: KeyCodes.up, shift: true});

    clearform:string;
    clearblock:string;

    enterquery:string = KeyMapper.map({code: 69, meta: true});
    executequery:string = KeyMapper.map({code: 69, shift: true, meta: true});
}