import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "app/common/services/index";
import css from "./signup.component.css!text";
import commonCss from "../common/auth.component.css!text";

@Component({
  selector : 'signup',
  template : `
      <div class="container signup-container modal-auth-container"><h1>Sign Up</h1><br>
          <form (ngSubmit)="onSubmit()" class="signup-form" novalidate #form="ngForm">
              <div class="signup-form-body">
                  <ngb-alert *ngIf="errors" (close)="errors=null" [type]="'danger'">{{errors.message}}</ngb-alert>
                  <div class="form-group"><input class="form-control" type="text" id="name" placeholder="Name"
                                                 [disabled]="loading" name="name" [(ngModel)]="name"
                                                 #nameField="ngModel"></div>
                  <div class="form-group"><input class="form-control" type="text" id="email" placeholder="Email"
                                                 [disabled]="loading" name="email" [(ngModel)]="email" required
                                                 #emailField="ngModel"></div>
                  <div class="form-group"><input class="form-control" type="password" id="password"
                                                 placeholder="Password" [disabled]="loading" name="password"
                                                 [(ngModel)]="password" required #passwordField="ngModel"></div>
                  <div class="form-group"><input class="form-control" type="password" id="password-confirm"
                                                 placeholder="Confirm Password" [disabled]="loading" name="password-confirm"
                                                 [(ngModel)]="passwordConfirm" required #passwordConfirmField="ngModel"></div>
              </div>
              <div class="signup-form-buttons">
                  <button class="btn btn-success" [disabled]="loading" type="submit">Sign Up</button>
                  <button routerLink="/signin" class="btn btn-link" [disabled]="loading">Sign In</button>
              </div>
          </form>
      </div>    `,
  styles : [css, commonCss]
})
export class SignUpComponent {

  loading : boolean;
  name : string;
  email : string;
  password : string;
  passwordConfirm : string;
  errors : any = null;

  constructor(@Inject(AuthService) private auth : AuthService,
              @Inject(Router) private router : Router,
  ) {}

  onSubmit() {
    if (this.password !== this.passwordConfirm) {
      this.errors = {message : "Passwords are not match!"};
      return;
    }
    this.loading = true;
    this.errors = null;
    this.auth.signUp({name : this.name, email : this.email, password :this.password})
      .then(({result, errors})=> {
        this.loading = false;
        if (result) {
          this.auth.getUser()
            .then(user => user.storages.google ? this.router.navigate(["/storages"]) : this.router.navigate(["/storages"]));
        }
        else {
          this.errors = errors;
        }
      })
  }

}