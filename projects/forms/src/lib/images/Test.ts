import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'test',
    template: 'HelloII <img style="width:16px; height:16px" src="{{image}}">',
    styles:['.image {background: url("../images/open.jpg.b64");}']
})

export class Test
{
    public image:string =
    `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`;


    constructor(private http:HttpClient)
    {
        console.log("trying to render image http: "+http);

        http.get<any>("/lib/images/open.jpg.b64").toPromise().then
        (
            data => {console.log(data);},
            error => {console.log(JSON.stringify(error));}
        )

    }
}
