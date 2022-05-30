import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../common/authentication-service.service"
import { environment } from "../../../environments/environment";

@Injectable()
export class DashboardService{
  BASE_URL = environment.baseUrl;
  VIEW_ANNOUNCEMENTS = this.BASE_URL + '/users/announcements';
  GET_STACK: string = this.BASE_URL + '/admin/metrics/stack';
  GET_LOCATION: string = this.BASE_URL + '/admin/metrics/location';
  GET_TRAINING: string = this.BASE_URL + '/admin/metrics/training';
  GET_PROJECT: string = this.BASE_URL + '/admin/metrics/projectwiseresources';
  
constructor(private http: HttpClient, private authentication: AuthenticationService){}

  GetAllAnouncements(accessToken){
    return this.http.get(this.VIEW_ANNOUNCEMENTS , { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authentication.getAuthToken() }) });
  }

  getStack(accessToken: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + accessToken
        }),
    };
    return this.http.get(this.GET_STACK, httpOptions);
};

getLocation(accessToken: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + accessToken
        }),
    };
    return this.http.get(this.GET_LOCATION, httpOptions);
};

getTraining(accessToken: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + accessToken
        }),
    };
    return this.http.get(this.GET_TRAINING, httpOptions);
};

getProject(accessToken: string) {
    const httpOptions = {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + accessToken
        }),
    };
    return this.http.get(this.GET_PROJECT, httpOptions);
};
}