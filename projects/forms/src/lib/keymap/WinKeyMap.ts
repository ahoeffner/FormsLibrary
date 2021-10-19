import { KeyCodes } from "./KeyCodes";
import { KeyMap, KeyMapper } from "./KeyMap";

export class WinKeyMap implements KeyMap
{
    zoom:string = KeyMapper.map({code: 90, ctrl: true});
    close:string = KeyMapper.map({code: 87, ctrl: true});

    undo:string = KeyMapper.map({code: 90, meta: true});
    paste:string = KeyMapper.map({code: 86, ctrl: true});

    enter:string = KeyMapper.map({code: KeyCodes.enter});
    escape:string = KeyMapper.map({code: KeyCodes.escape});

    listval:string = KeyMapper.map({code: KeyCodes.f9});

    clearblock:string = KeyMapper.map({code: KeyCodes.f5, shift: true});;
    clearform:string = KeyMapper.map({code: KeyCodes.f7, shift: true});

    insertafter:string = KeyMapper.map({code: KeyCodes.insert});
    insertbefore:string = KeyMapper.map({code: KeyCodes.insert, shift:true});

    dublicate:string = KeyMapper.map({code: 86, ctrl: true});
    delete:string = KeyMapper.map({code: KeyCodes.delete, ctrl: true});

    commit:string = KeyMapper.map({code: KeyCodes.f10, ctrl: false, shift: false});
    rollback:string = KeyMapper.map({code: KeyCodes.f10, ctrl: false, shift: true});

    connect:string = KeyMapper.map({code: 67, ctrl: true});
    disconnect:string = KeyMapper.map({code: 67, shift:true, ctrl: true});

    nextfield:string = KeyMapper.map({code: KeyCodes.tab});
    prevfield:string = KeyMapper.map({code: KeyCodes.tab, shift: true});

    nextrecord:string = KeyMapper.map({code: KeyCodes.down, shift: false});
    prevrecord:string = KeyMapper.map({code: KeyCodes.up, shift: false});

    prevblock:string = KeyMapper.map({code: KeyCodes.pageup, shift: true});
    nextblock:string = KeyMapper.map({code: KeyCodes.pagedown, shift: true});

    pageup:string = KeyMapper.map({code: KeyCodes.pageup});
    pagedown:string = KeyMapper.map({code: KeyCodes.pagedown});

    enterquery:string = KeyMapper.map({code: KeyCodes.f7});
    executequery:string = KeyMapper.map({code: KeyCodes.f8});

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
                <tr><td class="kmtd">   datepicker         </td><td>   F9                 </td></tr>
                <tr><td class="kmtd">   list of values     </td><td>   F9                 </td></tr>
                <tr><td class="kmtd">   clear block        </td><td>   shift-F5           </td></tr>
                <tr><td class="kmtd">   clear form         </td><td>   shift-F7           </td></tr>
                <tr><td class="kmtd">   insert after       </td><td>   insert             </td></tr>
                <tr><td class="kmtd">   insert before      </td><td>   shift-insert       </td></tr>
                <tr><td class="kmtd">   delete             </td><td>   delete             </td></tr>
                <tr><td class="kmtd">   commit             </td><td>   F10                </td></tr>
                <tr><td class="kmtd">   rollback           </td><td>   shift-F10          </td></tr>
                <tr><td class="kmtd">   next record        </td><td>   key-down           </td></tr>
                <tr><td class="kmtd">   previous record    </td><td>   key-up             </td></tr>
                <tr><td class="kmtd">   page down          </td><td>   pagedown           </td></tr>
                <tr><td class="kmtd">   page up            </td><td>   pageup             </td></tr>
                <tr><td class="kmtd">   next block         </td><td>   shift-pagedown     </td></tr>
                <tr><td class="kmtd">   previous block     </td><td>   shift-pageup       </td></tr>
                <tr><td class="kmtd">   enter query        </td><td>   F7                 </td></tr>
                <tr><td class="kmtd">   execute query      </td><td>   F8                 </td ></tr>
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