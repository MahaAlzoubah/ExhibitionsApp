import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
// import { AngularDatepickerModule } from 'angular-datepicker';
// import { DragDropModule } from '@angular/cdk/drag-drop';

const firebaseConfig = {
  apiKey: "AIzaSyB36QGKb8l32Lk9yJcSg2R0ZJlXbVZrApc",
  authDomain: "itcs444-finalproject.firebaseapp.com",
  projectId: "itcs444-finalproject",
  storageBucket: "itcs444-finalproject.appspot.com",
  messagingSenderId: "167037167864",
  appId: "1:167037167864:web:e0f5ab3717825ae0e5b30d",
  measurementId: "G-55QRC7D0CC"
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  // initialize angularfire with credentials from the dashboard
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  // Import the AngularFireDatabaseModule to use database
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth()),
  FormsModule, 
  // DragDropModule
  // AngularDatepickerModule
],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
