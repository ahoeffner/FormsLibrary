import { Form } from "../forms/Form";
import { keymap } from "../keymap/KeyMap";
import { MenuHandler } from './MenuHandler';


export class DefaultMenuHandler extends MenuHandler
{
    public form:Form;

    public onInit() : void
    {
        this.init();
    }

    public onConnect(): void
    {
        this.init();
    }

    public onDisconnect(): void
    {
        this.init();
    }

    public onFormChange(form: Form): void
    {
        this.form = form;
        if (this.ready) this.init();
    }

    public onTransactionChange(): void
    {
        if (this.transaction) this.enable("/transaction");
        else                  this.disable("/transaction");
    }

    private init() : void
    {
        this.disable();
        this.enable("/form/shortkeys");

        if (this.form != null)
        {
            this.enable("/form/close");
            this.enable("/section/next");
            this.enable("/section/previous");

            if (this.connected)
            {
                this.enable("/form");
                this.enable("/section");
                this.enable("/record");
                this.enable("/connection/disconnect");
            }
            else
            {
                this.enable("/connection/connect");
            }
        }
        else
        {
            if (this.connected)
            {
                this.enable("/connection/disconnect");
            }
            else
            {
                this.enable("/connection/connect");
            }
        }

        this.onTransactionChange();
    }

    public connect() : void
    {
        this.app.connect();
        this.init();
    }

    public disconnect() : void
    {
        this.app.disconnect();
        this.init();
    }

    public commit() : void
    {
        this.app.commit();
    }

    public rollback() : void
    {
        this.app.rollback();
    }

    public clear() : void
    {
        this.form?.sendKey(keymap.clearform);
    }

    public cancel() : void
    {
        this.form?.block?.cancel();
    }

    public enterFormQuery() : void
    {
        this.form?.enterquery();
    }

    public executeFormQuery() : void
    {
        this.form?.executequery();
    }

    public enterQuery() : void
    {
        this.form?.block?.enterquery();
    }

    public executeQuery() : void
    {
        this.form?.block?.executequery();
    }

    public deleteRecord() : void
    {
        this.form?.block?.delete();
    }

    public insertRecordAfter() : void
    {
        this.form?.block?.insert(false);
    }

    public insertRecordBefore() : void
    {
        this.form?.block?.insert(true);
    }

    public nextRecord() : void
    {
        this.form?.block?.nextrecord();
    }

    public prevRecord() : void
    {
        this.form?.block?.prevrecord();
    }

    public nextBlock() : void
    {
        this.form?.block?.nextblock();
    }

    public prevBlock() : void
    {
        this.form?.block?.prevblock();
    }

    public pageUp() : void
    {
        this.form?.block?.pageup();
    }

    public pageDown() : void
    {
        this.form?.block?.pagedown();
    }

    public close() : void
    {
        this.form?.close(false);
        this.init();
    }

    public showkeymap() : void
    {
        this.app.showKeyMap();
    }
}