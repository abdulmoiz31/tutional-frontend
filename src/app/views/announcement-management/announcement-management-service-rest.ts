import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { environment } from "../../../environments/environment";

@Injectable()
export class AnnouncementManagementService {

    BASE_URL = environment.baseUrl;
    ANNOUNCEMENT_URL = this.BASE_URL + '/admin/announcements';
    ADD_ANNOUNCEMENT = this.BASE_URL + '/admin/announcements';
    UPDATE_ANNOUNCEMENT = this.BASE_URL + '/admin/announcements';
    DELETE_ANNOUNCEMENT = this.BASE_URL + '/admin/announcements';

    constructor(private http: HttpClient, private authentication: AuthenticationService) { }

    getAllAnnouncements(accessToken) {
        return this.http.get(this.ANNOUNCEMENT_URL, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    addnewAnnouncement(formData) {
        return this.http.post(this.ADD_ANNOUNCEMENT, {
            "title": String(formData.title),
            "announcement": String(formData.announcement)
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    }

    updateAnnouncement(formData, data1) {

        return this.http.put(this.UPDATE_ANNOUNCEMENT, {
            "id": String(data1),
            "title": String(formData.title),
            "announcement": String(formData.announcement)
        }, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) })
    }


    deleteAnnouncement(id: number) {
        return this.http.delete(this.DELETE_ANNOUNCEMENT + '/' + id, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
    };
}