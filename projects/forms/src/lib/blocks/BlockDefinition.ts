import { Block } from './Block';
import { ControlBlock } from './ControlBlock';

export interface BlockDefinition
{
    name?:string,
    block:Block|ControlBlock
}