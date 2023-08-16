import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class LovManagementService {
    BASE_URL = environment.baseUrl;
    STACK_LOV_URL = this.BASE_URL + '/public/lov/stack';
    DESIGNATION_LOV_URL = this.BASE_URL + '/public/lov/designations';
    LOCATION_LOV__URL = this.BASE_URL + '/public/lov/locations';
    UPDATE_LOCATION_URL = this.BASE_URL + '/admin/add-location/';
    UPDATE_URL = this.BASE_URL + '/users';
    ADD_STACK_URL = this.BASE_URL + '/admin/stack';
    ADD_LOCTION_URL = this.BASE_URL + '/admin/location';
    ADD_DESIGATION_URL = this.BASE_URL + '/admin/designation';
    GET_STACK: string = this.BASE_URL + '/admin/metrics/stack';
    
    constructor(private http: HttpClient, private authentication: AuthenticationService) {};

    getStackLov(accessToken): any {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get(this.STACK_LOV_URL, httpOptions);
    }

    getDesignationLov(accessToken): any {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get(this.DESIGNATION_LOV_URL, httpOptions);
    }

    getCenter(accessToken): any {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get(this.LOCATION_LOV__URL, httpOptions);
    }

    addStack(data: any) {
        return this.http.post(this.ADD_STACK_URL, {
            "name": String(data.name),
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) }
        );
    };
    
    updateStack(name: string, id: number) {
        return this.http.put(`${this.ADD_STACK_URL}/${id}`, {
            'name': name
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    deleteStack(id: number) {
      return this.http.delete(`${this.ADD_STACK_URL}/${id}`, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    addLocation(data: any) {
        return this.http.post(this.ADD_LOCTION_URL, {
            "location_name": String(data.name),
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) }
        );
    };

    updateLocation(name: string, id: number) {
        return this.http.put(`${this.ADD_LOCTION_URL}/${id}`, {
            'name': name
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    deleteLocation(id: number) {
        return this.http.delete(`${this.ADD_LOCTION_URL}/${id}`, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    addDesignation(data: any) {
        return this.http.post(this.ADD_DESIGATION_URL, {
            "designation_name": String(data.name),
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) }
        );
    };

    updateDesignation(name: string, id: number) {
        return this.http.put(`${this.ADD_DESIGATION_URL}/${id}`, {
            'name': name
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    deleteDesignation(id: number) {
        return this.http.delete(`${this.ADD_DESIGATION_URL}/${id}`, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };
};
