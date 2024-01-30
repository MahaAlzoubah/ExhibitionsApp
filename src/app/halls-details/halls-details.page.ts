import { Component, OnInit } from '@angular/core';
import { FBserviceService, Halls, ReservationRequest } from '../fbservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, Firestore, getDoc, arrayUnion, where,collection } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-halls-details',
  templateUrl: './halls-details.page.html',
  styleUrls: ['./halls-details.page.scss'],
})
export class HallsDetailsPage implements OnInit {
  currentYear: number = new Date().getFullYear();
  Email: any;
  isSignIn = false;
  constructor(public auth:Auth, public Fb:FBserviceService, public activatedRoute:ActivatedRoute, 
              public firestore: Firestore, public router: Router, public navCtrl: NavController,
              public alertCtrl: AlertController) { 
                onAuthStateChanged(this.auth, async (user) => {
                  if (user) {
                    this.Email= user.email;
                    this.isSignIn = true;
                    console.log("User: "+user.email);
                    this.initializeData();
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
  
  async initializeData() {
    await this.callUser(); // Wait for callUser to complete
    this.checkReservations();
    this.calculateDateRange();  }


myReservationsDates: number[] = []; // Change the type to number
availableArray: number[] = [];
dayValuesString: string = '';

async checkReservations() {
  const querySnapshot = await getDocs(collection(this.firestore, 'reservationHalls'));

  querySnapshot.forEach((doc: any) => {
    const Rhall = doc.data();
    if (Rhall.HallName === this.hall.HallName) {
      const date = new Date(Rhall.date);
      const day = date.getDate(); // Get the day of the month
      this.myReservationsDates.push(day);
    }
  });

  console.log('myReservationsDates: ', this.myReservationsDates);

  for (let currentDate = new Date(this.minDate); currentDate <= new Date(this.maxDate); new Date(currentDate.setDate(currentDate.getDate() + 1).toString().split('T')[0])) {
    const day = currentDate.getDate();
    console.log("day: ", day);
    if (!this.myReservationsDates.includes(day)) {
      this.availableArray.push(day);
    }
  }  
  console.log("availableArray: ",this.availableArray);
  this.dayValuesString = this.availableArray.join(',');
  console.log('dayValuesString: ', this.dayValuesString);
}
  
  ngOnInit() {
  }
  public HallID = String(this.activatedRoute.snapshot.paramMap.get("hallID"));
  hall: any;
  available: any;
  type: any;
  isAdmin = false;



  async callUser() {
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

    console.log("HallID:",this.HallID);
    const docRef = doc(this.firestore, "halls", this.HallID);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      this.hall= docSnap.data();
      console.log("hall:",this.hall);
      this.available=this.hall.Availability;
      console.log("available:",this.available);
    } else {
      console.log("No such document!");
    }
}

selectedDate: Date = new Date(); // Store selected date for reservation
showCalendar: boolean = false; // Flag to show/hide calendar

today = new Date();
minDate: any; // Convert to ISO format
maxDate: any; // Add 7 days to today


ChangeCalendar() {
  this.showCalendar = !this.showCalendar;
}


calculateDateRange() {
  const today = new Date();
  this.minDate = today.toISOString().split('T')[0]; // Get YYYY-MM-DD part
  const maxDate = new Date();

  if (this.available === "Weekly Calendar") {
    maxDate.setDate(today.getDate() + 7); // Add 7 days to today
  } else {
    maxDate.setDate(today.getDate() + 30); // Add 30 days to today
  }

  this.maxDate = maxDate.toISOString().split('T')[0]; // Get YYYY-MM-DD part

}

userRequest: ReservationRequest | undefined;
async reserve() {
    if(!this.Email){
      const alert =await this.alertCtrl.create({
        header: "Wait..",
        message: "You can not reserve a hall, you must sign in first",
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.router.navigateByUrl('/home');
          }
        },
        {
          text: 'Cancle',
          handler: () => {
          }
        }]
      });

      alert.present();
    }else{
      
      this.userRequest ={
        Date: this.selectedDate,
        HallName: this.hall.HallName,
        Status: 'Pending',
        UserEmail: this.Email,
        image: this.hall.Image
      }
      this.Fb.addRequests(this.userRequest as ReservationRequest).then(async() => {
        const alert =await this.alertCtrl.create({
          header: "Done",
          message: "Your reservation has been completed successfully",
          buttons: ['Ok']
        });
  
        alert.present();
        this.ChangeCalendar();
      });
    }
}

isEditMode=false;

toggleEditMode(){
  this.isEditMode = !this.isEditMode;
}

EditHall(hall: Halls){
  this.Fb.updateHalls(hall,this.HallID).then(async (res) => {
    const alert =await this.alertCtrl.create({
      header: "",
      message: "Update successfully!",
      buttons: ['Ok']
    });

    alert.present();
  }).catch((err) => {
    console.log("Error in updateing");
  });
  this.toggleEditMode();
}


}
