export class Key
{
    public code:number;
    public alt:boolean;
    public ctrl:boolean;
    public meta:boolean;
    public shift:boolean;

    public toString() : string
    {
        return(this.code+" shift: "+this.shift+" ctrl: "+this.ctrl);
    }
}