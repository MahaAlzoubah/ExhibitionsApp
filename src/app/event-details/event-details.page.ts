//@ts-nocheck
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FBserviceService, Events, ReservationEvents } from '../fbservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, Firestore, getDoc, arrayUnion, where,collection } from '@angular/fire/firestore';
import { NavController, ModalController , ModalOptions } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.page.html',
    styleUrls: ['./event-details.page.scss'],
  })
export class EventDetailsPage implements OnInit {


 ngAfterViewInit(): void { 
    }
  


  currentYear: number = new Date().getFullYear();
  Email: any;
  isSignIn =false;


  constructor(public auth:Auth, public Fb:FBserviceService, public activatedRoute:ActivatedRoute, 
              public firestore: Firestore, public router: Router, public navCtrl: NavController,
              public alertCtrl: AlertController) { 
                onAuthStateChanged(this.auth, async (user) => {
                  if (user) {
                    this.isSignIn = true;
                    this.Email = user.email;
                    console.log("User: "+user.email);
                    const q = query(collection(this.firestore, "users"), where("Email", "==", this.Email));
                    const querySnapshot = await getDocs(q);
                  
                    if (!querySnapshot.empty) {
                      const docSnap = querySnapshot.docs[0];
                      const userData = docSnap.data();
                      this.type = userData['Type'];
                    }

                    if(this.type === 'User'){
                      this.isAdmin =false;
                    }else{
                      this.isAdmin =true;
                    }

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
    this.callUser();

  }


ngOnInit() {
  // this.updateGestures();
}

  

  public EventID = String(this.activatedRoute.snapshot.paramMap.get("EventID"));
  event: any;
  myAgenda: any[] =[];
  type: any;
  isAdmin = false;
  creator = false;
  async callUser() {
    console.log("EventID:",this.EventID);
    const docRef = doc(this.firestore, "events", this.EventID);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      this.event= docSnap.data();
      console.log("event:",this.event);
      this.fillMyAgenda();
    } else {
      console.log("No such document!");
    }

    if(this.event.UserEmail === this.Email){
      this.creator= true;
    }else{
      this.creator= false;
    }
}

fillMyAgenda(){
    this.event.Agenda.forEach( (data: any) => {
      const arr = data.split('#');
      console.log("arr: ", arr);
      this.myAgenda.push({
        title: arr[0],
        time: arr[1],
        speaker: arr[2]
      })
    });
     
    console.log("my agenda" ,this.myAgenda);
}


reservationEvent: ReservationEvents | undefined;
myHall: any;
capacity: any;
full = false;

  myResEvent: ReservationEvents[] = [];

async addResEvent(): Promise<void> {
  this.myResEvent = [];

  this.Fb.reservationEvents$?.pipe(take(1)).subscribe({
    next: async (reservationEvents: ReservationEvents[]) => {
      this.myResEvent = reservationEvents;

      const exists = this.myResEvent.some((Revent) => {
        return (
          Revent['EventName'] === this.event.EventName &&
          Revent['HallName'] === this.event.HallName &&
          Revent['userEmail'] === this.Email
        );
      });

      if (!exists) {
        this.reservationEvent = {
          EventName: this.event.EventName,
          HallName: this.event.HallName,
          userEmail: this.Email
        };

        await this.Fb.addReservationEvents(this.reservationEvent as ReservationEvents);

        const alert = await this.alertCtrl.create({
          header: "Done",
          message: "Hope you enjoy in the event",
          buttons: ['Ok']
        });

        alert.present();
      } else {
        const alert = await this.alertCtrl.create({
          header: "Done",
          message: "you already register in this event",
          buttons: ['Ok']
        });

        alert.present();
      }

      console.log(exists); // You can handle the result here
    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {
      // Optionally handle completion
    }
  });
}


async attend(){

  // if(!this.Email){
  //   const alert =await this.alertCtrl.create({
  //     header: "Wait..",
  //     message: "You can not attend an event, you must sign in first",
  //     buttons: [{
  //       text: 'Ok',
  //       handler: () => {
  //         this.router.navigateByUrl('/home');
  //       }
  //     },
  //     {
  //       text: 'Cancle',
  //       handler: () => {
  //       }
  //     }]
  //   });

  //   alert.present();
  // }else{
    const q = query(collection(this.firestore, "halls"), where("HallName", "==", this.event.HallName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      this.myHall = docSnap.data();
      this.capacity=this.myHall.Capacity;
    }

    const ref = doc(this.firestore, "events", this.EventID);

    if(Array.isArray(this.event.Attendees)){
      if (this.event.Attendees.length ===  this.capacity) {
        // const alert =await this.alertCtrl.create({
        //   header: "Sorry",
        //   message: "Sorry this event is full, join another event",
        //   buttons: ['Ok']
        // });

        // alert.present();
        this.full=true;
      } else {
        await updateDoc(ref, {
          Attendees: arrayUnion(this.Email)
        });
        this.addResEvent();
      }
    }else if (!Array.isArray(this.event.Attendees)) {
      await updateDoc(ref, {
        Attendees: arrayUnion(this.Email)
      });
      this.addResEvent();
    }
    else {
      console.error('Invalid data structure: Attendees is not an array');
    }
    
  // }
}

delete() {
  this.Fb.deleteEvents(this.EventID).then( async () => {
    const alert =await this.alertCtrl.create({
              header: "Done",
              message: "the event deleted successfully",
              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.router.navigateByUrl('/events');
                }
              }]
            });

    alert.present();
  })
}

}

