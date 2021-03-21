export class Criteria
{
    public value:string;
    public column:string;
    public operator:string;

    constructor(column:string, value:string, operator?:string)
    {
        this.column = column;
        
        if (operator != null)
        {
            this.value = value;
            this.operator = operator;
            return;
        }

        this.operator = "";
        value = value.trim();
        let quoted:boolean = false;

        if (value.startsWith("<")) this.operator = "<";
        else if (value.startsWith(">")) this.operator = ">";

        if (this.operator.length == 1)
        {
            this.value = this.value.substring(1).trim();
            if (value.startsWith("=")) this.operator += "=";
        }

        if (this.operator.length == 2)
            this.value = this.value.substring(1).trim();

        if (this.value.startsWith('"') && this.value.endsWith('"'))
        {
            quoted = true;
            this.value = this.value.substring(1,this.value.length-1);
        }

        if (this.value.startsWith("'") && this.value.endsWith("'"))
        {
            quoted = true;
            this.value = this.value.substring(1,this.value.length-1);
        }

        if (!quoted)
        {
            let like:boolean = false;
            if (this.value.indexOf("%") >= 0) like = true;
            if (this.value.indexOf("_") >= 0) like = true;
            if (like) this.operator = "like";
        }

        if (this.operator.length == 0) this.operator = "=";
    }
}