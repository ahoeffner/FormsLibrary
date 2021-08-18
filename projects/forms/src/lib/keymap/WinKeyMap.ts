import { KeyCodes } from "./KeyCodes";
import { KeyMap, KeyMapper } from "./KeyMap";

export class WinKeyMap implements KeyMap
{
    zoom:string = KeyMapper.map({code: 90, ctrl: true});
    close:string = KeyMapper.map({code: 87, ctrl: true});

    undo:string = KeyMapper.map({code: 90, meta: true});
    paste:string = KeyMapper.map({code: 86, meta: true});

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
    rollback:string = KeyMapper.map({code: KeyCodes.f1, ctrl: true, shift: true});

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
            <table>
                <tr><td class="kmtd">   connect            </td><td>   ctrl-c             </td></tr>
                <tr><td class="kmtd">   disconnect         </td><td>   ctrl-shift-c       </td></tr>
                <tr><td class="kmtd">   close              </td><td>   ctrl-w             </td></tr>
                <tr><td class="kmtd">   zoom               </td><td>   ctrl-z             </td></tr>
                <tr><td class="kmtd">   datepicker         </td><td>   ctrl-shift-l       </td></tr>
                <tr><td class="kmtd">   list of values     </td><td>   ctrl-shift-l       </td></tr>
                <tr><td class="kmtd">   clear block        </td><td>   ctrl-escape        </td></tr>
                <tr><td class="kmtd">   clear form         </td><td>   ctrl-shift-escape  </td></tr>
                <tr><td class="kmtd">   insert after       </td><td>   ctrl-i             </td></tr>
                <tr><td class="kmtd">   insert before      </td><td>   ctrl-shift-i       </td></tr>
                <tr><td class="kmtd">   delete             </td><td>   ctrl-d             </td></tr>
                <tr><td class="kmtd">   commit             </td><td>   ctrl-enter         </td></tr>
                <tr><td class="kmtd">   rollback           </td><td>   ctrl-shift-escape  </td></tr>
                <tr><td class="kmtd">   next record        </td><td>   key-down           </td></tr>
                <tr><td class="kmtd">   previous record    </td><td>   key-up             </td></tr>
                <tr><td class="kmtd">   page down          </td><td>   ctrl-p             </td></tr>
                <tr><td class="kmtd">   page up            </td><td>   ctrl-shift-p       </td></tr>
                <tr><td class="kmtd">   next block         </td><td>   shift-key-down     </td></tr>
                <tr><td class="kmtd">   previous block     </td><td>   shift-key-up       </td></tr>
                <tr><td class="kmtd">   enter query        </td><td>   ctrl-q             </td></tr>
                <tr><td class="kmtd">   execute query      </td><td>   ctrl-shift-q       </td ></tr>
            </table>

            <style>
              .kmtd
              {
                  width: 150px;
                  display: block;
              }
            </style>
        `;
    }
}