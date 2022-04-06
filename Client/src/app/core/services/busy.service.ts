import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyCount = 0;

  constructor(private ngxSpinnerService: NgxSpinnerService) {}

  busy() {
    this.busyCount++;
    this.ngxSpinnerService.show();
  }

  idle() {
    this.busyCount--;

    if (this.busyCount <= 0) {
      this.busyCount = 0;
      this.ngxSpinnerService.hide();
    }
  }
}
