import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userTypes } from '../mapping/userTypes';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  baseUrl = environment.baseUrl;
  LOGIN_URL = this.baseUrl + '/signin';
  LOGOUT_URL = this.baseUrl + '/auth/logout';
  UPDATE_URL = this.baseUrl + '/users';
  CHANGE_PASSWORD_URL = this.baseUrl + '/auth/password';
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
    return this.getUser().user_Type == userTypes.admin;
  }
  isAssociateUser() {
    return this.getUser().user_Type == userTypes.associate;
  }
  changePassword(accessToken, formPassword): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken
      }),

      "old_password": String(formPassword.old_password),
      "new_password": String(formPassword.new_password)
    };
    return this.http.put(this.CHANGE_PASSWORD_URL, formPassword, httpOptions)
  }
}

