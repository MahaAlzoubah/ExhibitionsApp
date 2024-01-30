import { Component,OnInit} from '@angular/core';
import { FBserviceService } from 'src/app/fbservice.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { getDocs, query, Firestore, where, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentYear: number = new Date().getFullYear();
  public users: any;
  UserEmail: any;
  name="";
  type="";
  isAdmin = true;
  isSignIn = false;

  constructor(private cdr: ChangeDetectorRef,public auth:Auth, public firestore: Firestore, 
    public alertCtrl: AlertController,public fbservice: FBserviceService , public router: Router) { 
    this.initialize();
  }

  async initialize() {
    try {
      const user = await new Promise<any>((resolve) => {
        onAuthStateChanged(this.auth, (user) => {
          resolve(user);
        });
      });

      if (user) {
        this.isSignIn = true;
        const userEmail = (user as any)?.email;
        this.UserEmail = String(userEmail);
        console.log("User: " + userEmail);
        this.callUser();
        this.callReservation();
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

  async callUser() {
    const q = query(collection(this.firestore, "users"), where("Email", "==", this.UserEmail));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      this.users = docSnap.data();
      this.name=this.users.Name;
      this.type=this.users.Type;
      console.log(this.type);
  }
  if(this.type == "User"){
    this.isAdmin = false;
  }
  else{
    this.isAdmin = true;
  }
}

// public thirtyDaysAgo = new Date();
reservations: any[] = [];
counts: any[] = [];
count: number =0;
History: {name: string, count: number}[] =[];

async callReservation() {
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const reservationQuery = query(
    collection(this.firestore, 'reservationHalls'),
    where('date', '>=', thirtyDaysAgo.toISOString())
  );  const reservationSnapshot = await getDocs(reservationQuery);

  if (!reservationSnapshot.empty) {
    const hallsQuery = query(collection(this.firestore, 'halls'));
    const hallsSnapshot = await getDocs(hallsQuery);

    const hallCounts: { [key: string]: number } = {};

    hallsSnapshot.forEach((hall) => {
      const aHall = hall.data();
      const hallName = aHall['HallName'];

      reservationSnapshot.forEach((doc) => {
        const aReservation = doc.data();
        // Check if 'HallName' exists in both hall and reservation
        if (hallName === aReservation['HallName']) {
          if (!hallCounts[hallName]) {
            hallCounts[hallName] = 1;
          } else {
            hallCounts[hallName]++;
          }
        }
      });
    });

    // Convert hallCounts object to array for display
    this.History = Object.keys(hallCounts).map((name) => ({
      name,
      count: hallCounts[name],
    }));

    console.log("this.history", this.History);
  } else {
    console.log("No documents found");
  }
}

  ngOnInit() {
  }

}
