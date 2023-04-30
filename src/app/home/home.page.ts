import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, SpinnerComponent, CommonModule],
})
export class HomePage {
  signingOut : boolean = false;

  constructor(public _auth: AuthService) {}

  handleSingOut(){
  this.signingOut = true;
    setTimeout(() => {
      this.signingOut = false;
      this._auth.SignOut();
    }, 2000);
  }}


