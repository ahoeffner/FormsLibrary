import { Case } from "../database/Case";
import { BindValue } from "../database/BindValue";


export interface ListOfValues
{
    size?:number;
    title?:string;
    width?:string;
    height?:string;

    case?:Case;
    minlen?:number;
    prefix?:string;
    postfix?:string;

    sql:string;
    rows?:number;
    bindvalues?: BindValue[];

    force?:boolean;
    fieldmap:Map<string,string>;
}