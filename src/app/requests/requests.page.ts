import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FBserviceService, ReservationHalls, ReservationRequest } from '../fbservice.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { getDocs, query, Firestore, where, collection } from '@angular/fire/firestore';
import { Animation, AnimationController, IonCard } from '@ionic/angular';
import { Router } from '@angular/router';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage{
  currentYear: number = new Date().getFullYear();

  isSignIn = false;
  Email: any;
  constructor(public firestore: Firestore, public auth:Auth, public router: Router, public fb:FBserviceService, 
              public alertCtrl: AlertController) {
     onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.Email= user.email;
        this.isSignIn = true;
        console.log("User: "+user.email);
        this.callUser();
      } else {
        this.isSignIn = false;
        const alert = await this.alertCtrl.create({
          header: "error",
          message: "You must sign in first",
          buttons : [{
            text: "Ok",
            handler: () => {
              this.router.navigateByUrl("/home");
            }
          },{
            text: "Cancle",
            handler: () => {

            }
          }]
        });

        alert.present();
      }
    });
  }

  async ngOnInit() {
    // await this.getDate(); 
    // console.log("this dates: ", this.dates);
  }

  MessageReject ="Rejected";
  MessageApprove ="Approved";
  // public dates: any[] = [];

  // async getDate() {
  //   try {
  //     const reservationRequests = await this.fb.reservationRequest$?.toPromise();

  //     if (reservationRequests) {
  //       for (const request of reservationRequests) {
  //         const date = request.Date.split('T')[0];
  //         this.dates.push(date);
  //         console.log("this dates: ", this.dates);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching reservation requests:', error);
  //   }
  // }

  type: any;
  isAdmin =false;
  async callUser() {
    const q = query(collection(this.firestore, "users"), where("Email", "==", this.Email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      this.type=data['Type'];
      console.log(this.type);
  }
  if(this.type == "User"){
    this.isAdmin = false;
  }
  else{
    this.isAdmin = true;
  }
}
  
  async reject(request: ReservationRequest){
      request.Status="Rejected";
      if(request.id){
        this.fb.updateRequests(request, request.id).then( async (res)=>{
          let alert = await this.alertCtrl.create({
            header: "Rejected",
            message: "Request Rejected",
            buttons: ["OK"]
          });
          alert.present();
        }).catch( async (err)=>{
          let alert = await this.alertCtrl.create({
            header: "Error",
            message: "Error in Rejection",
            buttons: ["OK"]
          });
          alert.present();
        })
      }
     
  }

  myReservation: any;

    async approve(request: ReservationRequest){
      request.Status="Approved";
      if(request.id){
        this.fb.updateRequests(request, request.id).then( async (res)=>{
          let alert = await this.alertCtrl.create({
            header: "Approved",
            message: "Request Approved",
            buttons: ["OK"]
          });
          alert.present();
        this.myReservation={
          HallName: request.HallName,
          UserEmail: request.UserEmail,
          date: request.Date
        } 
        this.fb.addreservationHalls(this.myReservation).then( () => {
          console.log("added to reservation");
        }).catch(() => {
          console.log("error in adding to reservation");
        });
          
        }).catch( async (err)=>{
          let alert = await this.alertCtrl.create({
            header: "Error",
            message: "Error in Approvtion",
            buttons: ["OK"]
          });
          alert.present();
        })
      }
  
    }


}