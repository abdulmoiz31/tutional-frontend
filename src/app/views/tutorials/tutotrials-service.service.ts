
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtillsService } from '../../common/utills-service.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TutorialsService {
    baseUrl = environment.baseUrl;
    TUTORIALS_URL = this.baseUrl + '/public/lov/tutorials'
    accessToken: string = "";
    constructor(private http: HttpClient) { }

    getTutorial(accessToken): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get(this.TUTORIALS_URL, httpOptions)
    }
}

