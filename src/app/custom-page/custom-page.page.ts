import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FBserviceService } from '../fbservice.service';
import { Firestore,collection, query, where, getDocs } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-custom-page',
  templateUrl: './custom-page.page.html',
  styleUrls: ['./custom-page.page.scss'],
})
export class CustomPagePage implements OnInit {
  currentYear: number = new Date().getFullYear();
  hall: any;
  HallName: string = '';
  date: string = '';
  UserEmail: any;
  name: string = '';
  agendaParts: any[] = [];
  numberOfParts: number = 0;
  myAgenda: string[] = [];
  updates: string = 'TBA';
  isSignIn =false;

  // agendaForm: FormGroup;
  constructor(public actR: ActivatedRoute, public firestore: Firestore, public fb: FBserviceService, public FB: FormBuilder,
              public alertCtrl: AlertController, public auth:Auth, public router: Router) {
                onAuthStateChanged(this.auth, async (user) => {
                  if (user) {
                    this.isSignIn = true;
                    this.UserEmail = user.email;
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
  

  ngOnInit() {
    this.actR.paramMap.subscribe((params) => {
      const data = params.get('data');
      if (data) {
        const parts = data.split('#');
        // parts=[j, i]
        this.HallName = String(parts[0]);
        this.date = String(parts[1]);
        console.log('Index1:', this.HallName);
        console.log('Index2:', this.date);
      }
    });
  }


  generateAgendaFields() {
    this.agendaParts = Array.from({ length: this.numberOfParts }, () => ({
      description: '',
      time: '',
      speaker: ''
    }));
  }
  
  trackByFn(index: number, item: any): number {
    return index;
  }
  
  public Fill=true;

  newEvent: any;

  async AddEvent() {
    // Check if name is empty
    if (this.name.trim() === '') {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Event name cannot be empty',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    // Check if any agenda part field is empty
    for (let i = 0; i < this.agendaParts.length; i++) {
      const part = this.agendaParts[i];
  
      if (part.description.trim() === '' || part.time.trim() === '' || part.speaker.trim() === '') {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Please fill all agenda part fields',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    }
  
    // Check if event already exists for the same hall and date
    const isEventExist = await this.fb.doesEventExist(this.HallName, this.date);
    if (isEventExist) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'An event already exists for the this hall',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    // All checks passed, proceed to add the event
    this.myAgenda = this.agendaParts.map(part => `${part.description}#${part.time}#${part.speaker}`);
  
    this.newEvent = {
      Agenda: this.myAgenda,
      UserEmail: this.UserEmail,
      HallName: this.HallName,
      EventName: this.name,
      Date: this.date,
      Updates: this.updates,
    };
    
    // Set the disabled state
    this.fb.disAbled = {
      hall: this.HallName,
      date: this.date
    };
  
    try {
      // Use try-catch block for asynchronous operations
      await this.fb.addEvents(this.newEvent);
      const alert = await this.alertCtrl.create({
        header: 'Done',
        message: 'Event Added',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigateByUrl('/events');
    } catch (error: any) {  // Explicitly type 'error' as 'any'
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message, // Display the actual error message
        buttons: ['OK']
      });
      await alert.present();
    }
    
  }
  
  
   
}

