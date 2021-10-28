export interface onEventListener
{
    onEvent(event:any) : void;
}


export class WindowListener
{
    private static events:Map<string,Map<string,onEventListener>> =
        new Map<string,Map<string,onEventListener>>();


    public static add(id:string, clazz:onEventListener, event:string) : void
    {
        let events:Map<string,onEventListener> = WindowListener.events.get(event);

        if (events == null)
        {
            events = new Map<string,onEventListener>();
            WindowListener.events.set(event,events);

            let listener:WindowListener = new WindowListener();
            listener.start(event);
        }

        events.set(id,clazz);
    }


    public static remove(id:string, event:string) : void
    {
        let events:Map<string,onEventListener> = WindowListener.events.get(event);
        events.delete(id);
    }


    private constructor() {}


    private start(eventtype:string) : void
    {
        window.addEventListener(eventtype, (event) => {this.onEvent(event)});
    }

    private onEvent(event:any) : void
    {
        let events:Map<string,onEventListener> = WindowListener.events.get(event.type);
        events.forEach((clazz) => {clazz.onEvent(event)});
    }
}