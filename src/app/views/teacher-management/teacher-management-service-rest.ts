import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class TeacherManagementService {

    BASE_URL = environment.baseUrl;
    USER_URL = this.BASE_URL + '/admin';
    SIGNUP_URL = this.BASE_URL + '/signup';
    INSTRUCTOR_URL = `${this.BASE_URL}/instructor`
    DELETE_USER = this.USER_URL + '/delete/';
    PROFILE_PICTURE_URL = this.BASE_URL + '/images/upload';
    
    constructor(private http: HttpClient, private authentication: AuthenticationService) { }

    getTeachers(accessToken): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get<string[]>(`${this.USER_URL}${'/teachers'}`, httpOptions);
    }

    updateUser(formData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.post(`${this.INSTRUCTOR_URL}/update`, formData, httpOptions);
    }

    getUserById(id){
        return this.http.post(`${this.USER_URL}/users`, { 'email': id }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    teacherSignup(formData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        
        return this.http.post(`${this.SIGNUP_URL}${'/teacher'}`, {
            email: String(formData.email),
            password: String(formData.password),
            name: String(formData.name),
            isDisabled: false
        }, httpOptions);
    }

    uploadCV(file: String, format, email){
        return this.http.post(`${this.INSTRUCTOR_URL}/cv`, { cv: file, fileFormat: format, email: email}, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });   
    }

    deleteUser(email) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.delete(`${this.DELETE_USER}${email}`, httpOptions);
    };

    uploadProfilePic(payload) {
        return this.http.post(this.PROFILE_PICTURE_URL, {image: payload.image, imageformat: payload.imageformat, email: payload.email}, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };
}