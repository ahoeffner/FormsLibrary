import { KeyCodes } from "./KeyCodes";
import { KeyMap, KeyMapper } from "./KeyMap";

export class MacKeyMap implements KeyMap
{
    undoform:string = KeyMapper.map({code: KeyCodes.escape, alt: true, shift:true, ctrl:true});
    undoblock:string = KeyMapper.map({code: KeyCodes.escape, shift:true, ctrl:true});
    undorecord:string = KeyMapper.map({code: KeyCodes.escape, shift:true, ctrl:true});

    enter:string = KeyMapper.map({code: KeyCodes.enter});
    escape:string = KeyMapper.map({code: KeyCodes.escape});

    insert:string;
    delete:string;
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

    enterquery:string;
    executequery:string;
}