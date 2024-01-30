import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, where } from '@angular/fire/firestore';
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
import { AlertController } from '@ionic/angular';
  
export interface Events {
  id?: string;
  Agenda: string;
  Attendees: string[];
  Updates: string;
  UserEmail: string;
  HallName: string;
  EventName: string;
  Date: string,
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
  HallName: string;
  userEmail: string;
  EventName: string;
}

export interface ReservationHalls {
  id?: string;
  HallName: string;
  UserEmail: string;
  date: Date;
}

export interface ReservationRequest {
  id?: string;
  Date: Date;
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
export interface AdminMessages{
  UserEmail: string;
  message: string[]
}

@Injectable({
  providedIn: 'root',
})
export class FBserviceService {

  disAbled: {
    hall: string;
    date: string;
  } = {
    hall: '',
    date: ''
  };


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

  public adminMessages$: Observable<AdminMessages[]> | undefined;
  public adminMessagesCollection: CollectionReference<DocumentData>;

  constructor(public firestore: Firestore, public auth:Auth, public router: Router, public alertCtrl: AlertController) {
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
    this.adminMessagesCollection = collection(this.firestore, 'adminMessages');
    this.getAdminMessages();
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

  // To get adminMessages from the database
  async getAdminMessages(){
    const q = query(collection(this.firestore,'adminMessages'));
    this.adminMessages$ = collectionData(q, { idField: 'id', }) as Observable<AdminMessages[]>;
  }

  addAdminMessages(adminMessage: AdminMessages): Promise<DocumentReference>{
    return addDoc( collection(this.firestore, 'adminMessages'), adminMessage);
   }

  addUsers(user: Users): Promise<DocumentReference>{
    return addDoc( collection(this.firestore, 'users'), user);
   }

  updateRequests(request: ReservationRequest, requestID: string): Promise<void> {
    return updateDoc(doc(this.firestore, 'reservationRequest', requestID), { 
      Date: request.Date,
      HallName: request.HallName,
      Status: request.Status,
      UserEmail: request.UserEmail,
      image: request.image,
    });
    
  }

//Create hall in Firestore with updateDoc()
updateHalls(hall: Halls, HallID: string): Promise<void>{
  return updateDoc(doc(this.firestore, "halls",  HallID), {
   Availability: hall.Availability,
   Description: hall.Description,
   HallName: hall.HallName,
   BusinessContact: hall.BusinessContact,
   Capacity: hall.Capacity,
   HallNum: hall.HallNum,
   Image: hall.Image,
   NumBooths: hall.NumBooths
  });
}
//Create hall in Firestore with updateDoc()
// updateEvents(event: Events, EventID: string): Promise<void>{
//   return updateDoc(doc(this.firestore, "events",  EventID), {
//     Date: event.Date,
//     Agenda: event.Agenda,
//     Attendees: event.Attendees,
//     Updates: event.Updates,
//     UserEmail: event.UserEmail,
//     HallName: event.HallName,
//     EventName: event.EventName
//   });
// }

//Add reservationRequest in Firestore
addRequests(ResRequest: ReservationRequest): Promise<DocumentReference>{
return addDoc( collection(this.firestore, 'reservationRequest'), ResRequest);
}

//Add Event 
addEvents(event: Events): Promise<DocumentReference>{
return addDoc( collection(this.firestore, 'events'), event);
}


//Add reservationHalls in Firestore
addreservationHalls(reservationHall: ReservationHalls): Promise<DocumentReference>{
  return addDoc( collection(this.firestore, 'reservationHalls'), reservationHall);
  }

//Add reservationEvents in Firestore
addReservationEvents(reservationEvents: ReservationEvents): Promise<DocumentReference>{
  return addDoc( collection(this.firestore, 'reservationEvents'), reservationEvents);
}

//Delete event
deleteEvents(EventID: string): Promise<void> {
  return deleteDoc(doc(this.firestore, 'events', EventID));
 }
  
Message="";
signIn(Email: string, password: string) {
  // Check if the user exists before signing in
      signInWithEmailAndPassword(getAuth(), Email, password)
        .then((userCredential) => {
          // Signed in 
          this.router.navigateByUrl('/dashboard');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.Message = "Invalid email or password";
        });
    } 
//Sign-up 
signUp(user: Users){
  createUserWithEmailAndPassword(getAuth(), user.Email, user.Password)
  .then((userCredential) => {
  // Signed up 
  const user = userCredential.user;
  // alert("user sign up");
  this.router.navigateByUrl('/dashboard');
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  let alert = this.alertCtrl.create({
    header: "Opss!",
    message: "Error in sign up",
    buttons: ["OK"]
  });
  alert.then(alert => alert.present())});
}

//Sign-out 
signOut(){
  signOut(getAuth())
.then((userCredential) => {
  // Signed out 
  this.router.navigateByUrl('/home');
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert("Error in sign out: " + errorMessage);
});

}

// Inside FBserviceService class
async doesEventExist(hall: string, date: string): Promise<boolean> {
  const q = query(collection(this.firestore, 'events'), where('HallName', '==', hall), where('Date', '==', date));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}



}