import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FBserviceService, ReservationRequest } from '../fbservice.service';
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
  constructor(public firestore: Firestore, public auth:Auth, public router: Router, public fb:FBserviceService, public alertCtrl: AlertController) {
   }

  ngOnInit() {
  }

  MessageReject ="Rejected";
  MessageApprove ="Approved";

  async reject(request: ReservationRequest){
      request.Status="Rejected";
      this.fb.updateRequests(request).then( async (res)=>{
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

    async approve(request: ReservationRequest){
      request.Status="Approved";
      this.fb.updateRequests(request).then( async (res)=>{
        let alert = await this.alertCtrl.create({
          header: "Approved",
          message: "Request Approved",
          buttons: ["OK"]
        });
        alert.present();
        
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




