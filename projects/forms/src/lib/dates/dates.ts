import {format as formatimpl, parse as parseimpl} from './fecha';


export interface datepart
{
    token:string;
    delim:string;
}


export class dates
{
    // Current implementation from
    // https://github.com/taylorhakes/fecha/blob/master/README.md


    private static delim:string = null;
    private static deffmt:string = null;
    private static tokens$:datepart[] = null;
    private static formattokens:Set<string> = null;

    private static init(format:string) : void
    {
        dates.deffmt = format;
        this.tokens$ = dates.split(format,"-/:. ");

        for(let i = 0; i < this.tokens$.length; i++)
        {
            if (this.tokens$[i].delim != " ")
            {
                dates.delim = this.tokens$[i].delim;
                break;
            }
        }

        dates.formattokens = new Set<string>();
        dates.formattokens.add("m");
        dates.formattokens.add("d");
        dates.formattokens.add("o");
        dates.formattokens.add("d");
        dates.formattokens.add("y");
        dates.formattokens.add("a");
        dates.formattokens.add("h");
        dates.formattokens.add("s");
        dates.formattokens.add("z");
    }

    public static setFormat(format:string) : void
    {
        dates.init(format);
    }

    public static parse(datestr:string, format?:string) : Date
    {
        if (format == null) format = dates.deffmt;

        if (datestr == null || datestr.trim().length == 0)
            return(null);

        let date:Date = parseimpl(datestr,format);
        if (date == null) datestr = dates.reformat(datestr);

        if (datestr == null) return(null);
        return(parseimpl(datestr,format));
    }

    public static format(date:Date, format?:string) : string
    {
        if (format == null) format = dates.deffmt;
        return(formatimpl(date,format));
    }

    private static reformat(datestr:string) : string
    {
        let ndate:string = "";

        if (!isNaN(+datestr))
        {
            let pos:number = 0;

            for(let i = 0; i < 3; i++)
            {
                let len:number = dates.tokens$[i].token.length;
                ndate += datestr.substring(pos,pos+len) + dates.tokens$[i].delim;
                pos += len;
            }

            return(ndate);
        }

        if (dates.delim != "-") datestr = dates.replaceAll(datestr,"-",dates.delim);
        if (dates.delim != "/") datestr = dates.replaceAll(datestr,"/",dates.delim);
        if (dates.delim != ".") datestr = dates.replaceAll(datestr,".",dates.delim);

        let parts:datepart[] = dates.split(datestr,dates.delim+": ");

        for (let i = 0; i < parts.length; i++)
        {
            let numeric:boolean = !isNaN(+parts[i].token);
            if (numeric && parts[i].token.length == 1) parts[i].token = "0"+parts[i].token;
        }

        parts.forEach((part) => {ndate += part.token+part.delim})

        return(ndate);
    }


    private static split(str:string, splitter:string) : datepart[]
    {
        let parts:datepart[] = [];
        let delimiters:Set<string> = new Set<string>();

        for (let i = 0; i < splitter.length; i++)
            delimiters.add(splitter[i]+"");

        let pos:number = 0;

        for (let i = 0; i < str.length; i++)
        {
            if (delimiters.has(str[i]+""))
            {
                parts.push({token: str.substring(pos,i), delim: str[i]});
                pos = i + 1;
            }
        }

        if (pos < str.length)
            parts.push({token: str.substring(pos,str.length), delim: ""});

        return(parts);
    }


    private static replaceAll(str:string, search:string, replace:string) : string
    {
        while(str.indexOf(search) >= 0) str = str.replace(search,replace);
        return(str);
    }
}