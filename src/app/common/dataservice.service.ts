import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    navchange: EventEmitter<String> = new EventEmitter();

    constructor() { }

    setAvatarUrl(url) {
        localStorage.setItem('avatarUrl', url);
    }
    getAvatarUrl() {
        return localStorage.getItem('avatarUrl');
    }
    updateProfilePicture(url) {
        localStorage.setItem('avatarUrl', url);
        this.navchange.emit(url);
    }

    getProfilePictureChangeEmitter() {
        return this.navchange;
    }
}