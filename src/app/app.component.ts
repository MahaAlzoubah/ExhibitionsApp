import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

  ReservedselectedDate: any; // Store selected date for reservation
  AvailableselectedDate: any;
  showCalendar: boolean = false; // Flag to show/hide calendar

  ChangeCalendar() {
    this.showCalendar = !this.showCalendar;
  }
  
  
  // calculateDateRange() {
  //   const today = new Date();
  //   this.minDate = today.toISOString().split('T')[0]; // Get YYYY-MM-DD part
  //   const maxDate = new Date();
  
  //   this.maxDate = maxDate.toISOString().split('T')[0]; // Get YYYY-MM-DD part
  // }
}
