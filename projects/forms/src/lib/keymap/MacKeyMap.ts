import { KeyCodes } from "./KeyCodes";
import { KeyMap, KeyMapper } from "./KeyMap";

export class MacKeyMap implements KeyMap
{
    zoom:string = KeyMapper.map({code: 90, ctrl: true});
    close:string = KeyMapper.map({code: 87, ctrl: true});

    enter:string = KeyMapper.map({code: KeyCodes.enter});
    escape:string = KeyMapper.map({code: KeyCodes.escape});

    listval:string = KeyMapper.map({code: 76, shift: true, ctrl: true});

    clearblock:string = KeyMapper.map({code: KeyCodes.escape, ctrl: true});;
    clearform:string = KeyMapper.map({code: KeyCodes.escape, shift: true, ctrl: true});

    insertafter:string = KeyMapper.map({code: 73, ctrl: true});
    insertbefore:string = KeyMapper.map({code: 73, shift:true, ctrl: true});

    delete:string = KeyMapper.map({code: 68, ctrl: true});
    dublicate:string = KeyMapper.map({code: 86, ctrl: true});

    commit:string = KeyMapper.map({code: KeyCodes.enter, ctrl: true});
    rollback:string = KeyMapper.map({code: KeyCodes.escape, ctrl: true});

    connect:string = KeyMapper.map({code: 67, ctrl: true});
    disconnect:string = KeyMapper.map({code: 67, shift:true, ctrl: true});

    nextfield:string = KeyMapper.map({code: KeyCodes.tab});
    prevfield:string = KeyMapper.map({code: KeyCodes.tab, shift: true});

    nextrecord:string = KeyMapper.map({code: KeyCodes.down, shift: false});
    prevrecord:string = KeyMapper.map({code: KeyCodes.up, shift: false});

    nextblock:string = KeyMapper.map({code: KeyCodes.down, shift: true});
    prevblock:string = KeyMapper.map({code: KeyCodes.up, shift: true});

    pageup:string = KeyMapper.map({code: 80, ctrl: true, shift: true});
    pagedown:string = KeyMapper.map({code: 80, ctrl: true, shift: false});

    enterquery:string = KeyMapper.map({code: 81, ctrl: true});
    executequery:string = KeyMapper.map({code: 81, shift: true, ctrl: true});

    map:string;


    public constructor()
    {
        this.map =
        `
        Keymap:
            <table>
            </table>
        `;
    }
}