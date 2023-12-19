import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FBserviceService } from '../fbservice.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { getDocs, query, Firestore, where, collection } from '@angular/fire/firestore';
import { Animation, AnimationController, IonCard } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  currentYear: number = new Date().getFullYear();
  
  @ViewChildren(IonCard, { read: ElementRef })cardElements!: QueryList<ElementRef<HTMLIonCardElement>>;

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
  Email: any ="Ali.mo7@gmail.com";
  name="";
  type="";
  reservationRequestData: any[] = [];
  reservationEventData: any[] = [];
  constructor(public auth:Auth, public firestore: Firestore, public fbservice: FBserviceService, private animationCtrl: AnimationController , public router: Router) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            this.Email = user.email;
            console.log("User: "+user.email);
        } else {

        }
    });

    this.callUser();
    this.callRequests();
    this.callEvents();
  
  }
  ngAfterViewInit() {
    this.cardAnimation();
  }

  async cardAnimation() {
    const cardElements = this.cardElements.toArray();

    for (let i = 0; i < cardElements.length; i++) {
      const cardAnimation: Animation = this.animationCtrl
        .create()
        .addElement(cardElements[i].nativeElement)
        .duration(1500)
        .fromTo('transform', 'translateX(100px)', 'translateX(0px)')
        .fromTo('opacity', '1', '1');

      await cardAnimation.play().catch((err) => console.error(err));
    }
  } 




    async callUser() {
      const q = query(collection(this.firestore, "users"), where("Email", "==", this.Email));
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        this.users = docSnap.data();
        this.name=this.users.Name;
        this.type=this.users.Type;
    }
  }

  async callRequests() {
    const q = query(collection(this.firestore, "reservationRequest"), where("UserEmail", "==", this.Email));
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
      const q = query(collection(this.firestore, "reservationEvents"), where("userEmail", "==", this.Email));
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
  

}
