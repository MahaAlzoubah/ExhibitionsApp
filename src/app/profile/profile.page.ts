import { Component, ViewChild, ElementRef, QueryList, OnInit } from '@angular/core';
import { FBserviceService } from '../fbservice.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { getDocs, query, Firestore, where, collection } from '@angular/fire/firestore';
import { AlertController, Animation, AnimationController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage{
  currentYear: number = new Date().getFullYear();
  
  @ViewChild(IonContent, { read: ElementRef }) content !: ElementRef<HTMLIonContentElement>;

  private animation: Animation | any ;

  status = [
    {
    name: 'Pending',
    iconName: 'time-outline',
    color: 'warning'
    },
  {
    name: 'Approved',
    iconName: 'happy-outline',
    color: 'success'
  },
  {
    name: 'Rejected',
    iconName: 'sad-outline',
    color: 'danger'
  }
];
  public users: any;
  UserEmail: any;
  name="";
  type="";
  reservationRequestData: any[] = [];
  reservationEventData: any[] = [];
  public isAdmin=true;
  isSignIn =false;
  constructor(public auth:Auth, public firestore: Firestore, public fbservice: FBserviceService, private animationCtrl: AnimationController , public router: Router, public alertCtrl: AlertController) {
    this.initialize();
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

  async initialize() {
    try {
      const user = await new Promise<any>((resolve) => {
        onAuthStateChanged(this.auth, (user) => {
          resolve(user);
        });
      });

      if (user) {
        this.isSignIn =true;
        const userEmail = (user as any)?.email;
        this.UserEmail = String(userEmail);
        console.log("User: " + userEmail);
        this.callUser();
        this.callRequests();
        this.callEvents();
      } else {
        this.isSignIn =false;
        this.warning();
      }
    } catch (error) {
      console.error("Error during authentication state change:", error);
    }
  }
  
  async warning(){
    let alert = await this.alertCtrl.create({
      header: "Opss!",
      message: "you must sign in first",
      buttons: [{
        text: "Ok",
        handler: () => {
          this.router.navigateByUrl('/home');
        }
      },{
        text: "Cancel",
        handler: () => {
        }
      }]
    });
    alert.present();
  }
  ngAfterViewInit() {
    setTimeout(()=> {
      this.ElementsAnimation();
    }, 1000)

  }


  
  // change here

  async ElementsAnimation() {
    const contentAnimation = this.animationCtrl
      .create()
      .addElement(this.content.nativeElement)
      .duration(500)
      .fromTo('transform', 'translateX(100px)', 'translateX(0px)')
      .fromTo('opacity', '0', '1')

    await contentAnimation.play();
  
  }
    async callUser() {
      const q = query(collection(this.firestore, "users"), where("Email", "==", this.UserEmail));
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        this.users = docSnap.data();
        this.name=this.users.Name;
        this.type=this.users.Type;
    }
    if(this.type == "User"){
      this.isAdmin = false;
    }
    else{
      this.isAdmin = true;
    }
  }

  async callRequests() {
    const q = query(collection(this.firestore, "reservationRequest"), where("UserEmail", "==", this.UserEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
 
      querySnapshot.forEach((doc) => {
        // Access the data of each document using doc.data()
         console.log("doc.data: ", doc.data());
         this.reservationRequestData.push(doc.data());
   
        // Now you can use reservationRequestData as needed
        console.log("reservationRequestData: ", this.reservationRequestData);
  
        // If you need the document ID, you can use doc.id
        const reservationRequestId = doc.id;
        console.log("Document ID:", reservationRequestId);
      });
    }
    else {
      console.log("No documents found");
    }
  }
  async callEvents() {
    try {
      const q = query(collection(this.firestore, "reservationEvents"), where("userEmail", "==", this.UserEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log("doc.data: ", doc.data());
          this.reservationEventData.push(doc.data());
          const reservationEventId = doc.id;
          console.log("Document ID:", reservationEventId);
        });
      } else {
        console.log("No documents found");
      }
    } catch (error) {
      console.error("Error fetching reservation events:", error);
    }
  }
  

  signOut(){
    this.fbservice.signOut();
  }

}
