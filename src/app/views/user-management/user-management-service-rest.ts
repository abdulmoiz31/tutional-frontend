import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IDS, USER_TYPES } from "../../constants/app.constants";

@Injectable()
export class UserManagementService {
    BASE_URL = environment.baseUrl;
    USER_URL = this.BASE_URL + '/admin';
    STACK_LOV_URL = this.BASE_URL + '/public/lov/stack';
    DESIGNATION_LOV_URL = this.BASE_URL + '/public/lov/designations';
    LOCATION_LOV__URL = this.BASE_URL + '/public/lov/locations';
    CV_URL = this.BASE_URL + '/users/cv_attachment/';
    ALL_CV_URL = this.CV_URL + 'get_all/';
    UPDATE_LOCATION_URL = this.BASE_URL + '/admin/add-location';
    UPDATE_DESIGNATION_URL = this.BASE_URL + '/admin/add-designation';
    UPDATE_URL = this.BASE_URL + '/users';
    SIGNUP_URL = this.BASE_URL + '/signup';
    PROFILE_PICTURE_URL = this.BASE_URL + '/images/upload';
    DELETE_USER = this.USER_URL + '/delete/';
    INSTRUCTOR_URL = `${this.BASE_URL}/instructor`
    
    constructor(private http: HttpClient, private authentication: AuthenticationService) {};

    fetchUserdetail(id) {
        return this.http.get(this.USER_URL + id, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }
    
    getStudents(accessToken): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get<string[]>(`${this.USER_URL}${'/students'}`, httpOptions);
    }

    getUserById(id){
        return this.http.post(`${this.USER_URL}/users`, { 'email': id }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    getTeachers(accessToken): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get<string[]>(`${this.USER_URL}${'/teachers'}`, httpOptions);
    }

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

    uploadCV(file, name, id) {
        return this.http.post(this.CV_URL + id, { 'name': name, 'base64String': file }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    deleteCV(name, id) {
        let req = new HttpRequest('DELETE', this.CV_URL + id);
        let newReq = req.clone({ body: { 'name': name }, headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
        return this.http.request(newReq);
    }

    getAllCVS(id) {
        return this.http.get(this.ALL_CV_URL + id, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    updateUser(formData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.post(`${this.INSTRUCTOR_URL}/update`, formData, httpOptions);
    }

    studentSignup(formData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        
        return this.http.post(`${this.SIGNUP_URL}${'/student'}`, formData, httpOptions);
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

    getProfilepic(id: number): any {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get(`${this.PROFILE_PICTURE_URL}${id}`, httpOptions);
    };

    uploadProfilePic(payload) {
        return this.http.post(this.PROFILE_PICTURE_URL, {image: payload.image, imageformat: payload.imageformat, email: payload.email}, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    updateLocation(formData, id: number) {
        return this.http.post(`${this.UPDATE_LOCATION_URL}/${id}`, {
            'locationId': formData.center
            }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    updateDesignation(formData, id: number) {
        return this.http.post(`${this.UPDATE_DESIGNATION_URL}/${id}`, {
            'designationId': formData.designation
            }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };

    deleteUser(email) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.delete(`${this.DELETE_USER}${email}`, httpOptions);
    };
};
