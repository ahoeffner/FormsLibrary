import { Field } from "../input/Field";
import { BlockBase } from "./BlockBase";
import { Record } from "../blocks/Record";
import { Listener } from "../events/Listener";
import { FieldInstance } from "../input/FieldInstance";


interface InstListener
{
    inst:any;
    lsnr:Listener;
}


class EventListener
{
    keys:Map<string,InstListener[]> = new Map<string,InstListener[]>();
    types:Map<string,InstListener[]> = new Map<string,InstListener[]>();
}


export class BlockBaseImpl
{
    private listener:EventListener = new EventListener();
    private records:Map<number,Record> = new Map<number,Record>();
    private fields$:Map<number,FieldInstance> = new Map<number,FieldInstance>();

    constructor(private block:BlockBase) {}

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

    public addListener(instance:any, listener:Listener, types:string|string[], keys?:string|string[]) : void
    {
        if (types != null)
        {
            let typesarr:string[] = [];
            let array:boolean = false;
            if (types.constructor.name == "Array") array = true;

            if (array) typesarr = types as string[];
            else       typesarr.push(types as string);

            typesarr.forEach((type) =>
            {
                type = type.toLowerCase();

                if (type != "key" || keys == null)
                {
                    let lsnrs:InstListener[] = this.listener.types.get(type);

                    if (lsnrs == null)
                    {
                        lsnrs = [];
                        this.listener.types.set(type,lsnrs);
                    }

                    lsnrs.push({inst: instance, lsnr: listener});
                }
            });
        }

        if (keys != null)
        {
            let keysarr:string[] = [];
            let array:boolean = false;
            if (keys.constructor.name == "Array") array = true;

            if (array) keysarr = keys as string[];
            else       keysarr.push(keys as string);

            keysarr.forEach((key) =>
            {
                key = key.toLowerCase();
                let lsnrs:InstListener[] = this.listener.keys.get(key);

                if (lsnrs == null)
                {
                    lsnrs = [];
                    this.listener.keys.set(key,lsnrs);
                }

                lsnrs.push({inst: instance, lsnr: listener});
            });
        }
    }

    public onEvent(field:FieldInstance, type:string, key?:string) : void
    {
        if (type == "focus")
        {
            this.records.get(+field.row).current = true;
        }

        let lsnrs:InstListener[] = this.listener.types.get(type);
        if (lsnrs != null) lsnrs.forEach((ilsnr) =>
        {
            ilsnr.inst[ilsnr.lsnr.name](field,type);
        });

        if (type == "key")
        {
            lsnrs = this.listener.keys.get(key);
            if (lsnrs != null) lsnrs.forEach((ilsnr) =>
            {
                ilsnr.inst[ilsnr.lsnr.name](field,type,key);
            });
        }
    }
}