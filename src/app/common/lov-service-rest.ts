import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication-service.service";

@Injectable()
export class LOVManagementService {

    BASE_URL = environment.baseUrl;
    LOV_URL = `${this.BASE_URL}/lov`

    constructor(private http: HttpClient, private authentication: AuthenticationService) {};

    getLOV(typeId) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get(`${this.LOV_URL}/${typeId}`, httpOptions);
    }
}