import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { Observable } from "rxjs";
import { userTypes } from "../../mapping/userTypes";
import { environment } from "../../../environments/environment";

@Injectable()
export class UserManagementService {
    BASE_URL = environment.baseUrl;
    USER_URL = this.BASE_URL + '/users/';
    STACK_LOV_URL = this.BASE_URL + '/public/lov/stack';
    DESIGNATION_LOV_URL = this.BASE_URL + '/public/lov/designations';
    LOCATION_LOV__URL = this.BASE_URL + '/public/lov/locations';
    CV_URL = this.BASE_URL + '/users/cv_attachment/';
    ALL_CV_URL = this.CV_URL + 'get_all/';
    UPDATE_LOCATION_URL = this.BASE_URL + '/admin/add-location';
    UPDATE_DESIGNATION_URL = this.BASE_URL + '/admin/add-designation';
    UPDATE_URL = this.BASE_URL + '/users';
    SIGNUP_URL = this.BASE_URL + '/auth/signup';
    PROFILE_PICTURE_URL = this.USER_URL + 'profile_picture/';
    DELETE_USER = this.BASE_URL + '/admin/';
    
    constructor(private http: HttpClient, private authentication: AuthenticationService) {};

    fetchUserdetail(id) {
        return this.http.get(this.USER_URL + id, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }
    
    getUsers(accessToken): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + accessToken
            }),
        };
        return this.http.get<string[]>(this.USER_URL, httpOptions);
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

    updateUser(formData, id) {

        if (this.authentication.isAdmin()) {
            let pLead = [];
            let currentProject = [];
            let toDostack = [];
            let currentStack = [];
            let loc = { _id: "619de5aa3cbf58e51e14f5f4" };
            for (let i = 0; i < formData.projectDetailSection.length; i++) {
                currentProject.push({
                    "project_Name": formData.projectDetailSection[i].currentprojects
                });
                pLead.push({
                    "p_Lead_Name": formData.projectDetailSection[i].projectlead
                })
            }
            for (let i = 0; i < formData.currentstack.length; i++) {
                currentStack.push({
                    "stack_detail": formData.currentstack[i].item_id
                });
            }
            for (let i = 0; i < formData.todostack.length; i++) {
                toDostack.push({
                    "stack_detail": formData.todostack[i].item_id
                });
            }
            return this.http.put(this.UPDATE_URL + "/" + id, {
                "contact_num": String(formData.contact),
                "experience": Number(formData.experiance),
                "linkedin_URL": String(formData.linkedinlink),
                "Current_Projects": currentProject,
                "project_Lead": pLead,
                "current_Stack": currentStack,
                "to_Do_Stack": toDostack
            }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) })
        }
        else {
            return this.http.put(this.UPDATE_URL + "/" + id, {
                "contact_num": String(formData.contact),
                "experience": Number(formData.experiance),
                "linkedin_URL": String(formData.linkedinlink)
            }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) })
        }
    }

    signup(formData) {
        let usertype = formData.usertype;
        if (usertype == "admin") {
            usertype = userTypes.admin;
        }
        if (usertype == "associate") {
            usertype = userTypes.associate;
        }
        return this.http.post(this.SIGNUP_URL, {
            "username": String(formData.username),
            "password": String(formData.password),
            "emp_Id": String(formData.employeeId),
            "user_Type": String(usertype),
            "designation": String(formData.designation)
        });
    }

    getProfilepic(id: number): any {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.authentication.getAuthToken()
            }),
        };
        return this.http.get(`${this.PROFILE_PICTURE_URL}${id}`, httpOptions);
    };

    uploadProfilePic(file: String, id: number) {
        return this.http.post(this.PROFILE_PICTURE_URL + id, { 'base64String': file }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
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

    deleteUser(id: number) {
        return this.http.delete(this.DELETE_USER + id,
            { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };
};
