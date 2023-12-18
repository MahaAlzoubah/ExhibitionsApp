import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName: string = 'John Doe'; // Replace with actual user name
  userEmail: string = 'john@example.com'; // Replace with actual user email
  reservedHalls: any[] = [
    { name: 'Hall A' },
    { name: 'Hall B' },
    // Add more reserved halls as needed
  ];
  reservedEvents: any[] = [
    { name: 'Event X' },
    { name: 'Event Y' },
    // Add more reserved events as needed
  ];
  constructor() { }

  ngOnInit() {
  }

}
