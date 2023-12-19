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
  id?: string;
  Agenda: string;
  Attendees: string[];
  Exhibition: string;
  Speakers: string[];
  Updates: string;
  UserID: string;
  HallName: string;
  EventName: string;
}

export interface Halls {
  id?: string;
  HallNum: string;
  Availability: string;
  Description: string;
  HallName: string;
  BusinessContact: string;
  Capacity: string;
  Image: string;
  NumBooths: string;
}

export interface ReservationEvents {
  id?: string;
  EventID: string;
  userEmail: string;
  EventName: string;
}

export interface ReservationHalls {
  id?: string;
  HallName: string;
  UserID: string;
  date: Data;
}

export interface ReservationRequest {
  id: string;
  Date: Data;
  HallName: string;
  Status: string;
  UserEmail: string;
  image: string;
}

export interface Users {
  id?: string;
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

  public reservationHalls$: Observable<ReservationHalls[]> | undefined;
  public rHallsCollection: CollectionReference<DocumentData>;

  public reservationRequest$: Observable<ReservationRequest[]> | undefined;
  public rRequestCollection: CollectionReference<DocumentData>;

  public users$: Observable<Users[]> | undefined;
  public usersCollection: CollectionReference<DocumentData>;

  constructor(public firestore: Firestore, public auth:Auth, public router: Router) {
    this.eventsCollection = collection(this.firestore, 'events');
    this.getEvents();
    this.hallsCollection = collection(this.firestore, 'halls');
    this.getHalls();
    this.rEventsCollection = collection(this.firestore, 'reservationEvents');
    this.getResEvents();
    this.rHallsCollection = collection(this.firestore, 'reservationHalls'); 
    this.getResHalls();
    this.rRequestCollection = collection(this.firestore, 'reservationRequest');
    this.getRequests();
    this.usersCollection = collection(this.firestore, 'users');
    this.getUsers();
  }

  // To get Events from the database
  async getEvents(){
    const q = query(collection(this.firestore,'events'));
    this.events$ = collectionData(q, { idField: 'id', }) as Observable<Events[]>;
  }

  // To get halls from the database
  async getHalls(){
    const q = query(collection(this.firestore,'halls'));
    this.halls$ = collectionData(q, { idField: 'id', }) as Observable<Halls[]>;
  }
  // To get events reservation from the database
  async getResEvents(){
    const q = query(collection(this.firestore,'reservationEvents'));
    this.reservationEvents$ = collectionData(q, { idField: 'id', }) as Observable<ReservationEvents[]>;
  }
  // To get reserved halls from the database
// To get reserved halls from the database
async getResHalls() {
  const q = query(collection(this.firestore, 'reservationHalls'));
  this.reservationHalls$ = collectionData(q, { idField: 'id' }) as Observable<ReservationHalls[]>;
}


  // To get requests from the database
  async getRequests(){
   const q = query(collection(this.firestore,'reservationRequest'));
   this.reservationRequest$ = collectionData(q, { idField: 'id', }) as Observable<ReservationRequest[]>;
  }


  // To get users from the database
  async getUsers(){
    const q = query(collection(this.firestore,'users'));
    this.users$ = collectionData(q, { idField: 'id', }) as Observable<Users[]>;
  }

  Message="";
  signIn(Email: string, password: string){
    signInWithEmailAndPassword(getAuth(), Email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("user sign in");
    this.router.navigateByUrl('/view-activity');

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // alert("Error in sign in: " + errorMessage + error.code);
    this.Message="invalid email or password";
  });
  }

  //Sign-up 
  signUp(Email: string, password: string){
    createUserWithEmailAndPassword(getAuth(), Email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("user sign up");
    this.router.navigateByUrl('/view-activity');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error in sign up: " + errorMessage);
  });

  }

  //Sign-out 
  signOut(){
    signOut(getAuth())
  .then((userCredential) => {
    // Signed out 
    alert("user sign out");
    this.router.navigateByUrl('/');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error in sign out: " + errorMessage);
  });

  }

  //Add reservationRequest in Firestore
addRequests(ResRequest: ReservationRequest): Promise<DocumentReference>{
  return addDoc( collection(this.firestore, 'reservationRequest'), ResRequest);
 }

  updateRequests(request: ReservationRequest): Promise<void> {
    return updateDoc(doc(this.firestore, 'reservationRequest', request.id), { 
      Date: request.Date,
      HallName: request.HallName,
      Status: request.Status,
      UserEmail: request.UserEmail,
      image: request.image,
    });
    
  }
  

}
