import { Component } from '@angular/core';
// import fbservice
import { FBserviceService, Users } from '../fbservice.service';

// import form builder
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userForm: FormGroup;
  constructor(public fb : FBserviceService, private FB : FormBuilder) 
  {
    this.userForm = FB.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9]{3,}@[a-zA-Z]+\.[a-zA-Z]{3,}$/)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z|A-Z])[a-zA-Z\s]+$/)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/)])],
    });
  }

  email="";
  name="";
  password="";
  type="";

  signedIn=true;
  currentYear: number = new Date().getFullYear();

  signIn()
  {
    this.fb.signIn(this.email, this.password);
  }
  
  newuser: any;
  async signUp(value: any)
  {
    if(this.userForm.valid)
    { 
      const userEmail = value.email.toLowerCase();
      this.newuser ={
        Email: userEmail,
        Name: value.name,
        Password: value.password,
        Type: 'User',
      }
      this.fb.signUp(this.newuser);
      this.fb.addUsers(this.newuser)
        .then((res)=> { console.log("Added Successfully");})
        .catch((err)=> { console.log("Error in adding");});
    }
    }
  }


