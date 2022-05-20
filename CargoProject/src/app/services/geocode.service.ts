
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GeocodeService {
    url: string =
        "https://discover.search.hereapi.com/v1/geocode?apiKey=VfMTefQBFa7_gkV33eyqExbIgt4XUekUlwZmOPYrFZ0&q=";
    constructor(private _http: HttpClient) {}
    geocode(location): Observable<any> {
        return this._http.get<any>(this.url + location)
            .pipe(
                tap(data =>
                    console.log(JSON.stringify(data["items"][0]["position"])))
            );
    }
}