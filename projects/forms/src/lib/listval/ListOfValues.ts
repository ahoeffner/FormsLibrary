import { Case } from "../database/Case";
import { BindValue } from "../database/BindValue";


export interface ListOfValues
{
    title?:string;
    width?:string;
    height?:string;

    case?:Case;
    prefix?:string;
    postfix?:string;

    sql:string;
    rows?:number;
    bindvalues?: BindValue[];

    fieldmap:Map<string,string>;
}