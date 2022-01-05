import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FirebaseService } from './services/firebase.service';

const config = {
  apiKey: "AIzaSyA7luWGbMhIgXImE-ZnHWwWljs35kK6GRg",
  authDomain: "cargo-management-4e50a.firebaseapp.com",
  projectId: "cargo-management-4e50a",
  storageBucket: "cargo-management-4e50a.appspot.com",
  messagingSenderId: "1097151939401",
  appId: "1:1097151939401:web:9a6e54511306e455825098",
  measurementId: "G-BG7G8D3TDQ"
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
