import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { USER_TYPES } from '../constants/app.constants';
@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  baseUrl = environment.baseUrl;
  LOGIN_URL = this.baseUrl + '/signin';
  LOGOUT_URL = this.baseUrl + '/signin/logout';
  UPDATE_URL = this.baseUrl + '/users';
  CHANGE_PASSWORD_URL = this.baseUrl + '/signin/changepassword';
  accessToken: string = "";
  constructor(private http: HttpClient) { }
  login(formData) {
    return this.http.post(this.LOGIN_URL, {
      "email": String(formData.email),
      "password": String(formData.password)
    });
  }
  setUser(resData) {
    localStorage.setItem('User', JSON.stringify(resData));
  }
  setAuthToken(token) {
    localStorage.setItem('Authtoken', String(token));
  }
  getUser() {
    return JSON.parse(localStorage.getItem('User'));
  }
  getAuthToken() {
    return localStorage.getItem('Authtoken')
  }
  logout() {
    return this.http.get(this.LOGOUT_URL, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.getAuthToken() }) });
  }
  removeUser() {
    localStorage.removeItem('User');
  }
  removeAccessToken() {
    localStorage.removeItem('Authtoken');
  }
  clearLocalStorage() {
    this.removeUser();
    this.removeAccessToken();
  }
  isAdmin() {
    return this.getUser().userType == USER_TYPES.adminUser;
  }
  isTeacher() {
    return this.getUser().user_Type == USER_TYPES.teacherUser;
  }
  changePassword(accessToken, formPassword): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getAuthToken()
      })
    };
    return this.http.patch(this.CHANGE_PASSWORD_URL,{oldPassword: String(formPassword.old_password), newPassword: String(formPassword.new_password)}, httpOptions)
  }
}

