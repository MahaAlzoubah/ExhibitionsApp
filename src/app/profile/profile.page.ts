import { Component } from '@angular/core';
import { FBserviceService } from '../fbservice.service';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, Firestore, getDoc, arrayUnion, where,collection } from '@angular/fire/firestore';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userName: string = 'John Doe';
  userEmail: string = 'john@example.com';
  reservedHalls: any[] = [
    { name: 'Hall A' },
    { name: 'Hall B' },
    { name: 'Hall C' },
    { name: 'Hall C' },
    { name: 'Hall C' },
    { name: 'Hall C' },
    { name: 'Hall C' },
    { name: 'Hall C' },
    { name: 'Hall C' },
  ];
  reservedEvents: any[] = [
    { name: 'Event X' },
    { name: 'Event Y' },
  ];
  accordionState: { [key: string]: boolean } = {};

  constructor() {}

  toggleAccordion(section: string): void {
    this.accordionState[section] = !this.accordionState[section];
  }

  isAccordionOpen(section: string): boolean {
    return this.accordionState[section] || false;
  }
}
