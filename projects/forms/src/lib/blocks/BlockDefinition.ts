import { Block } from './Block';
import { Form } from '../forms/Form';
import { ControlBlock } from './ControlBlock';

export interface BlockDefinition
{
    form:Form,
    name?:string,
    vname:string,
    block?:Block|ControlBlock
}