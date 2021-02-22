export interface onEventListener
{
    onEvent(event:any) : void;
}


export class Listener
{
    private static events:Map<string,Map<string,onEventListener>> =
        new Map<string,Map<string,onEventListener>>();


    public static add(clazz:onEventListener, event:string) : void
    {
        let events:Map<string,onEventListener> = Listener.events.get(event);

        if (events == null)
        {
            events = new Map<string,onEventListener>();
            Listener.events.set(event,events);

            let listener:Listener = new Listener();
            listener.start(event);
        }

        events.set(clazz.constructor.name,clazz);
    }


    public static remove(clazz:onEventListener, event:string) : void
    {
        let events:Map<string,onEventListener> = Listener.events.get(event);
        events.delete(clazz.constructor.name);
    }


    private constructor() {}


    private start(eventtype:string) : void
    {
        window.addEventListener(eventtype, (event) => {this.onEvent(event)});
    }

    private onEvent(event:any) : void
    {
        let events:Map<string,onEventListener> = Listener.events.get(event.type);
        events.forEach((value) => {value.onEvent(event)});
        console.log("Listener "+event.type+" "+events.size);
    }
}