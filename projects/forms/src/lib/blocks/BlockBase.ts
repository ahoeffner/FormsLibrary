import { Field } from "../input/Field";
import { Record } from "../blocks/Record";
import { Listener } from "../events/Listener";
import { FieldInstance } from "../input/FieldInstance";

class EventListener
{
    keys:Map<string,Listener[]> = new Map<string,Listener[]>();
    types:Map<string,Listener[]> = new Map<string,Listener[]>();
}

export class BlockBase
{
    private listener:EventListener = new EventListener();
    private records:Map<number,Record> = new Map<number,Record>();
    private fields$:Map<number,FieldInstance> = new Map<number,FieldInstance>();


    public getRecord(row:number) : Record
    {
        return(this.records[+row]);
    }

    public addRecord(record:Record) : void
    {
        this.records.set(+record.row,record);
        record.fields.forEach((field) => {field.block = this});
    }

    public set fields(fields:Map<number,FieldInstance>)
    {
        this.fields$ = fields;
    }

    public getField(row:number, name:string) : Field
    {
        return(this.records.get(+row)?.getField(name));
    }

    public getFieldInstance(id:number) : FieldInstance
    {
        return(this.fields$.get(+id));
    }

    public addListener(listener:Listener) : void
    {
        if (listener.types != null)
        {
            let types:string[] = [];
            let array:boolean = false;
            if (listener.types.constructor.name == "Array") array = true;

            if (array) types = listener.types as string[];
            else       types.push(listener.types as string);

            types.forEach((type) =>
            {
                type = type.toLowerCase();

                if (type != "key" || listener.keys == null)
                {
                    let lsnrs:Listener[] = this.listener.types.get(type);

                    if (lsnrs == null)
                    {
                        lsnrs = [];
                        this.listener.types.set(type,lsnrs);
                    }

                    lsnrs.push(listener);
                }
            });
        }

        if (listener.keys != null)
        {
            let keys:string[] = [];
            let array:boolean = false;
            if (listener.types.constructor.name == "Array") array = true;

            if (array) keys = listener.types as string[];
            else       keys.push(listener.types as string);

            keys.forEach((key) =>
            {
                key = key.toLowerCase();
                let lsnrs:Listener[] = this.listener.keys.get(key);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.listener.keys.set(key,lsnrs);
                }

                lsnrs.push(listener);
            });
        }
    }

    // this is accessed behind the scenes
    private _onEvent(field:FieldInstance, type:string, key?:string) : void
    {
        if (type == "focus")
        {
            this.records.get(+field.row).current = true;
        }

        let lsnrs:Listener[] = this.listener.types.get(type);
        if (lsnrs != null) lsnrs.forEach((lsnr) => {lsnr.listener(field,type)});

        lsnrs = this.listener.keys.get(key);
        if (lsnrs != null) lsnrs.forEach((lsnr) => {lsnr.listener(field,type,key)});
    }
}