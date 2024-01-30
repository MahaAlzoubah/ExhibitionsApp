import { Component, OnInit } from '@angular/core';
import { FBserviceService, Events } from '../fbservice.service';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, Firestore, getDoc, arrayUnion, where,collection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
  })
export class EventsPage implements OnInit {
  isSignIn =false;
  constructor(public auth:Auth, public FB: FormBuilder, public Fb: FBserviceService, public firestore:Firestore,
              public router: Router, public alertCtrl:AlertController) {
    this.initializeEvent();
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.isSignIn = true;
        console.log("User: "+user.email);
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

  eventID: any;
  async goTo(hallName: string, date: string){
    console.log("hallName: " , hallName , "+" , "date", date);
    const querySnapshot = await getDocs(collection(this.firestore, "events"));
    querySnapshot.forEach((doc: any) => {
      const event = doc.data();
      console.log("event date: " , event);
      if(event.HallName == hallName && event.Date == date){
        this.eventID = doc.id;
      }
    });
    console.log("event id: " , this.eventID);
   this.router.navigate(['../event-details/',this.eventID ]);
  }

  // Assuming you have a method in your Firebase service to fetch events
  
  myEvents: Events[] = [];
  AllEvents: Events[] = [];
  async initializeEvent() {
    const querySnapshot = await getDocs(collection(this.firestore, "events"));

    querySnapshot.forEach((doc: any) => {
      this.myEvents.push(doc.data() as Events);
    });

    // Save a copy of all events for later filtering
    this.AllEvents = this.myEvents;
  }

  getEvent(ev: any) {
    // Reset myEvents to the original state before filtering
    this.myEvents =this.AllEvents;

    // set val to the searchbar value
    let val = ev.target.value;
  
    // Filter myEvents based on event name
    this.myEvents = this.myEvents.filter((event) => {
      return event.EventName.toLowerCase().includes(val.toLowerCase());
    });

  }
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
  }

}
