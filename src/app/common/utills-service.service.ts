import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtillsService {

  constructor(private toaster: ToastrService) { }

  showSuccess(message) {
    this.toaster.success(message, 'Success!', {
      timeOut: 5000,
      closeButton: true
    });
  }

  showError(error) {
    this.toaster.error(error, 'Error!', {
      timeOut: 5000,
      closeButton: true
    });
  }
}