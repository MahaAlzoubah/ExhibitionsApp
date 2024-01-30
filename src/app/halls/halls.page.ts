import { Component, OnInit } from '@angular/core';
import { FBserviceService, Halls, ReservationHalls } from '../fbservice.service';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, Firestore, getDoc, arrayUnion, where,collection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-halls',
  templateUrl: './halls.page.html',
  styleUrls: ['./halls.page.scss'],
})
export class HallsPage implements OnInit {

  filterOption: string = 'all'; // default filter option
  selectedDate: string = ''; // variable to store selected date
  selectedCapacity: number | null = null; // variable to store selected capacity

  reservationHalls: ReservationHalls[] = []; // add this property to store reservation data
  isSignIn = false;
  // hallsForm: FormGroup;
  constructor(public auth:Auth, public Fb: FBserviceService, public firestore:Firestore,
              public router: Router, public alertCtrl: AlertController) {
        this.initializeHall();
        this.applyFilter(); // initialize reservation data
    // this.hallsForm = this.FB.group({
    //   Availability: ['',Validators.required],
    //   Description: ['',Validators.required],
    //   HallName: ['',Validators.required],
    //   BusinessContact:['',Validators.required],
    //   Capacity: ['', Validators.required],
    //   HallNum: ['', Validators.required],
    //   Image: ['',Validators.required],
    //   NumBooths: ['',Validators.required],
      
    // });
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

  async applyFilter() {
    switch (this.filterOption) {
      case 'all':
        this.filteredHalls = this.AllHalls;
        console.log("all filteredHalls: ",this.filteredHalls);
        break;

      case 'available':
        if (this.selectedDate) {
          console.log("selectedDate: ",this.selectedDate);
          console.log("available filteredHalls: ",this.filteredHalls);
          await this.ReservedHall(this.selectedDate);
          console.log("available filteredHalls: ",this.filteredHalls);
          this.filteredHalls = this.AllHalls.filter(hall => {
            console.log("!this.isReserve(hall.HallName)", !this.isReserve(hall.HallName));
            return !this.isReserve(hall.HallName);
          });
        } else {
          this.filteredHalls = this.AllHalls;
        }
        break;
      case 'reserved':
        if (this.selectedDate) {
          await this.ReservedHall(this.selectedDate);
          this.filteredHalls = this.AllHalls.filter(hall => {
            return this.isReserve(hall.HallName);
          });
          console.log("reserved filteredHalls: ",this.filteredHalls);
        } else {
          this.filteredHalls = this.AllHalls;
        }
        break;
      case 'capacity':
        if (this.selectedCapacity) {
          this.filteredHalls = this.AllHalls.filter((hall) => { 
            return String(hall.Capacity) === String(this.selectedCapacity)
          });
          console.log("capacity filteredHalls: ",this.filteredHalls);
        } else {
          this.filteredHalls = this.AllHalls;
        }
        break;
      default:
        this.filteredHalls = this.AllHalls;
    }
  }

  ReserviedHalls: any;
  async ReservedHall(selcDate: any){
    this.ReserviedHalls=[];
    const q = collection(this.firestore, "reservationHalls");
     const querySnapshot = await getDocs(q);
   
     if (!querySnapshot.empty) {
      console.log("querySnapshot.docs: ",querySnapshot.docs);
      querySnapshot.forEach((Rhall) => {
        const reservHall = Rhall.data();
        console.log("reservHall['date']: ",reservHall['date']);
        console.log("String(selcDate): ",String(selcDate));
        console.log("new Date(reservHall['date']).toISOString().split('T')[0]): ",new Date(reservHall['date']).toISOString().split('T')[0]);
        if(new Date(reservHall['date']).toISOString().split('T')[0] === String(selcDate)){
          this.ReserviedHalls.push(reservHall['HallName']);
        }
      });
    }
    console.log("this.ReserviedHalls: ", this.ReserviedHalls);
  }

  isReserve(hallName: string): boolean {
    for (const hall of this.ReserviedHalls) {
      if (hall && hall === hallName) {
        return true; // Exit the function if condition is met
      }
    }
    return false;
  }
  

  
  hallID: any;
  async goTo(hallName: string){
    const querySnapshot = await getDocs(collection(this.firestore, "halls"));
    querySnapshot.forEach((doc: any) => {
      const hall = doc.data();
      if(hall.HallName == hallName){
        this.hallID = doc.id;
      }
    });
   this.router.navigate(['../halls-details/',this.hallID ]);
  }

  AllHalls: Halls[] =[];
  filteredHalls: Halls[] = [];

  async initializeHall() {
    const querySnapshot = await getDocs(collection(this.firestore, "halls"));
  
    querySnapshot.forEach((doc: any) => {
      this.filteredHalls.push(doc.data() as Halls);
    });

    this.AllHalls = this.filteredHalls;
  }

  // goToDetail(hallNum: any){
  //  this.router.navigateByUrl("../halls-details/hall.id")
  // }

  getHall(ev: any) {
    // Reset myHalls to the original state before filtering
    this.filteredHalls = this.AllHalls;
  
    // set val to the searchbar value
    let val = ev.target.value;

      // Filter myHalls based on hall name
      this.filteredHalls = this.filteredHalls.filter((hall) => {
        return hall.HallName.toLowerCase().includes(val.toLowerCase());
      });
  }

  // add(hall: Halls){
  //   if (this.hallsForm.valid) {
  //     this.Fb.addHalls(hall).then((res) => {
  //        alert("Added successfully");
  //      }).catch((err) => {
  //        console.log("Error in adding");
  //      });
  //   }
  // }
  currentYear: number = new Date().getFullYear();


  ngOnInit() {
    this.applyFilter();
  }

}
