import {format as formatimpl, parse as parseimpl} from './fecha'

export class dates
{
    // Current implementation from
    // https://github.com/taylorhakes/fecha/blob/master/README.md


    private static tokens:Set<string> = null;

    private static init() : void
    {
        dates.tokens = new Set<string>();
        dates.tokens.add("m");
        dates.tokens.add("d");
        dates.tokens.add("o");
        dates.tokens.add("d");
        dates.tokens.add("y");
        dates.tokens.add("a");
        dates.tokens.add("h");
        dates.tokens.add("s");
        dates.tokens.add("z");
    }

    public static parse(datestr:string, format:string) : Date
    {
        if (datestr == null || datestr.trim().length == 0)
            return(null);

        let date:Date = parseimpl(datestr,format);
        if (date == null) datestr = dates.reformat(datestr,format);

        if (datestr == null) return(null);
        return(parseimpl(datestr,format));
    }

    public static format(date:Date, format:string) : string
    {
        return(formatimpl(date,format));
    }

    private static reformat(datestr:string, format:string) : string
    {
        if (dates.tokens == null)
            dates.init();

        let delim:string = "-";

        for(let i = 0; i < format.length; i++)
        {
            if (!dates.tokens.has((""+format[i]).toLowerCase()))
            {
                delim = ""+format[i];
                break;
            }
        }

        if (delim != "-") datestr = dates.replaceAll(datestr,"-",delim);
        if (delim != "/") datestr = dates.replaceAll(datestr,"/",delim);
        if (delim != ".") datestr = dates.replaceAll(datestr,".",delim);

        let parts:any[] = dates.split(datestr,delim+": ");

        for (let i = 0; i < parts.length; i++)
        {
            let numeric:boolean = !isNaN(+parts[i].part);
            if (numeric && parts[i].part.length == 1) parts[i].part = "0"+parts[i].part;
        }

        let ndate:string = "";
        parts.forEach((part) => {ndate += part.part+part.delim})

        return(ndate);
    }


    private static split(str:string, splitter:string) : any[]
    {
        let parts:any[] = [];
        let delimiters:Set<string> = new Set<string>();

        for (let i = 0; i < splitter.length; i++)
            delimiters.add(splitter[i]+"");

        let pos:number = 0;

        for (let i = 0; i < str.length; i++)
        {
            if (delimiters.has(str[i]+""))
            {
                parts.push({part: str.substring(pos,i), delim: str[i]});
                pos = i + 1;
            }
        }

        if (pos < str.length)
            parts.push({part: str.substring(pos,str.length), delim: ""});

        return(parts);
    }


    private static replaceAll(str:string, search:string, replace:string) : string
    {
        while(str.indexOf(search) >= 0) str = str.replace(search,replace);
        return(str);
    }
}