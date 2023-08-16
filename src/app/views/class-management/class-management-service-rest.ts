import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class ClassManagementService {

    BASE_URL = environment.baseUrl;
    ADMIN_URL = this.BASE_URL + '/admin';
    CLASS_URL = this.ADMIN_URL + '/class';
    
    constructor(private http: HttpClient, private authentication: AuthenticationService) { }

    getClasses(): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get<string[]>(`${this.CLASS_URL}`, httpOptions);
    }

    getClassById(id){
        return this.http.post(`${this.CLASS_URL}`, { 'classId': id }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    getStudents(): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get<string[]>(`${this.ADMIN_URL}${'/students'}`, httpOptions);
    }

    getTeachers(): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get<string[]>(`${this.ADMIN_URL}${'/teachers'}`, httpOptions);
    }

    createClass(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        
        return this.http.post(`${this.CLASS_URL}${'/create'}`, payload, httpOptions);
    }

    updateClass(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        
        return this.http.post(`${this.CLASS_URL}${'/update'}`, payload, httpOptions);
    }

    deleteClass(classId) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.delete(`${this.CLASS_URL}${'/delete/'}${classId}`, httpOptions);
    }
}