import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { environment } from "../../../environments/environment";

@Injectable()
export class TutorialManagementService {

    BASE_URL = environment.baseUrl;
    TUTORIALS_URL = this.BASE_URL + '/public/lov/tutorials';
    ADD_TUTORIAL = this.BASE_URL + '/admin/tutorials';
    UPDATE_TUTORIAL = this.BASE_URL + '/admin/tutorials';

    constructor(private http: HttpClient, private authentication: AuthenticationService) { }

    getAllTutorials(accessToken) {
        return this.http.get(this.TUTORIALS_URL, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    getTutorialbyID(accessToken, id) {
        return this.http.get(this.TUTORIALS_URL + id, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    addnewTutorial(formData) {
        return this.http.post(this.ADD_TUTORIAL, {
            "tutorial_Name": String(formData.tutorial_name),
            "tutorial_URL": String(formData.tutorial_url)
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    updateTutorialbyID(formData, id) {
        return this.http.put(this.UPDATE_TUTORIAL + "/" + id, {
            "tutorial_Name": String(formData.tutorial_name),
            "tutorial_URL": String(formData.tutorial_url)
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) })
    };

    deleteTutorial(id: number) {
        return this.http.delete(`${this.UPDATE_TUTORIAL}/${id}`, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };
}