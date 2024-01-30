import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminMessages, FBserviceService } from '../fbservice.service';
import { Firestore,collection, query, where, getDocs, arrayUnion, updateDoc, doc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  currentYear: number = new Date().getFullYear();

  isSignIn =false;
  Email: any;
  constructor(public actR: ActivatedRoute, public firestore: Firestore, public fb: FBserviceService, public FB: FormBuilder,
    public alertCtrl: AlertController, public auth:Auth, public router: Router){
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.isSignIn = true;
        this.Email = user.email;
        this.callUser();
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

  isAdmin =false;
  type: any;

  async callUser() {
    const q = query(collection(this.firestore, "users"), where("Email", "==", this.Email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const user = docSnap.data();
      this.type=user['Type'];
      console.log(this.type);
  }
  if(this.type == "User"){
    this.isAdmin = false;
    this.UploadMessage();
  }
  else{
    this.isAdmin = true;
  }
}



  newAdminMessages: any;
  arrayOfMessages: any[] = [];
  DocumentID: any;
  newMessage: string = '';

  async UploadMessage() {
    const q = query(collection(this.firestore, "adminMessages"), where("UserEmail", "==", this.Email));
     const querySnapshot = await getDocs(q);
   
     if (!querySnapshot.empty) {
       const docSnap = querySnapshot.docs[0];
       const Data = docSnap.data();
       this.DocumentID = docSnap.id;
       this.arrayOfMessages = Data['message'];

     }else{
      this.arrayOfMessages =[];
      this.newAdminMessages = {
        UserEmail: this.Email,
        message: this.arrayOfMessages
      }
      this.fb.addAdminMessages(this.newAdminMessages as AdminMessages).then(()=> {
        console.log("add new Message successfully");
      });
     }
     this.updateArrayMessage();
  }

  async sendMessage(){
    if (this.newMessage.trim() !== '') {
      this.newMessage =this.newMessage + "#" + this.type;
      this.arrayOfMessages.push(this.newMessage);
      const ref = doc(this.firestore, "adminMessages", this.DocumentID);
      await updateDoc(ref, {
        message: this.arrayOfMessages
      }).then(()=> {
        console.log("add new Message successfully");
      });
      this.newMessage = '';
   }
   this.updateArrayMessage();
   console.log("arrayOfMessages: ", this.arrayOfMessages);
}

DetailMessage: { message: any, sender: any }[] = [];
updateArrayMessage(){
  this.DetailMessage= [];
  this.arrayOfMessages.forEach( (mes) => {
    const parts = mes.split('#');
    this.DetailMessage.push({message: parts[0], sender: parts[1]});
  });
}
async ChangeMode(myEmail: any){
 this.isAdmin = false;
 this.Email=myEmail;
 this.UploadMessage();
}
}
