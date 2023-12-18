import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query } from '@angular/fire/firestore';
import { Data } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';
import {
    Auth,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendSignInLinkToEmail
  } from '@angular/fire/auth';
import { Router } from '@angular/router';
  
export interface Events {
  id: string;
  Agenda: string;
  Description: string;
  HallName: string;
  Attendees: string[];
  Exhibition: string;
  Speakers: string[];
  Updates: string;
  UserID: string;
}

export interface Halls {
  id: string;
  Availability: string;
  BusinessContact: string;
  Capacity: string;
  HallName: string;
  HallNum: string;
  Image: string;
  NumBooths: string;
}

export interface ReservationEvents {
  EventID: string;
  UserID: string;
}

export interface ReservationHalls {
  HallNum: string;
  UserID: string;
}

export interface ReservationRequest {
  Date: Data;
  HallNum: string;
  Status: 'Pending';
  UserID: string;
}

export interface Users {
  Email: string;
  Name: string;
  Password: string;
  Type: string;
}

@Injectable({
  providedIn: 'root',
})
export class FBserviceService {

  public events$: Observable<Events[]> | undefined;
  public eventsCollection: CollectionReference<DocumentData>;

  public halls$: Observable<Halls[]> | undefined;
  public hallsCollection: CollectionReference<DocumentData>;

  public reservationEvents$: Observable<ReservationEvents[]> | undefined;
  public rEventsCollection: CollectionReference<DocumentData>;

  public reservationHalls$: Observable<ReservationEvents[]> | undefined;
  public rHallsCollection: CollectionReference<DocumentData>;

  public reservationRequest$: Observable<ReservationRequest[]> | undefined;
  public rRequestCollection: CollectionReference<DocumentData>;

  public users$: Observable<Users[]> | undefined;
  public usersCollection: CollectionReference<DocumentData>;

  constructor(public firestore: Firestore, public auth:Auth, public router: Router) {
    this.eventsCollection = collection(this.firestore, 'events');
    this.getEvents();
    this.hallsCollection = collection(this.firestore, 'halls');
    this.rEventsCollection = collection(this.firestore, 'reservationEvents');
    this.rHallsCollection = collection(this.firestore, 'reservationHalls'); 
    this.rRequestCollection = collection(this.firestore, 'reservationRequest');
    this.usersCollection = collection(this.firestore, 'users');
  }

  // To get Events from the database
  async getEvents(){
    const q = query(collection(this.firestore,'events'));
    this.events$ = collectionData(q, { idField: 'id', }) as Observable<Events[]>;
  }


}
