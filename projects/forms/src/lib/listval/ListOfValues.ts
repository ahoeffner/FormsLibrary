import { Case } from "../database/Case";
import { BindValue } from "../database/BindValue";


export interface ListOfValues
{
    size?:number;
    title?:string;
    width?:string;
    height?:string;

    value?:any;

    case?:Case;
    minlen?:number;
    prefix?:string;
    postfix?:string;

    sql:string;
    rows?:number;
    autoquery:boolean;
    bindvalues?: BindValue[];

    force?:boolean;
    fieldmap:Map<string,string>;
}