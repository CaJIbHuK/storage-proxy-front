import {Component, Inject} from "@angular/core";
import {AuthService} from "../services/index";

@Component({
  selector : 'signin',
  template : `
    <div>
        <label for="email"></label>
        <input id="email" [(ngModel)]="email" type="text">
        <label for="password"></label>
        <input id="password" [(ngModel)]="password" type="password">
        <button (click)="onSubmit()">SUBMIT</button>
    </div>
  `
})
export class SignInComponent {

  email : string;
  password : string;

  constructor(@Inject(AuthService) private auth : AuthService) {}

  onSubmit() {
    this.auth.signIn({email : this.email, password :this.password});
  }

}