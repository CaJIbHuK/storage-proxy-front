import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "app/common/services/index";
import css from "./signin.component.css!text";
import commonCss from "../common/auth.component.css!text";

@Component({
  selector : 'signin',
  template : `
      <div class="container signin-container modal-auth-container"><h1>Sign in to Your Account</h1><br>
          <form (ngSubmit)="onSubmit()" class="signin-form" novalidate #form="ngForm">
              <div class="signin-form-body">
                  <ngb-alert *ngIf="error" (close)="error=false" [type]="'danger'">{{texts.error}}</ngb-alert>
                  <div class="form-group"><input class="form-control" type="text" id="email" placeholder="Email"
                                                 [disabled]="loading" name="email" [(ngModel)]="email" required
                                                 #emailField="ngModel"></div>
                  <div class="form-group"><input class="form-control" type="password" id="password"
                                                 placeholder="Password" [disabled]="loading" name="password"
                                                 [(ngModel)]="password" required #passwordField="ngModel"></div>
              </div>
              <div class="signin-form-buttons">
                  <button class="btn btn-success" [disabled]="loading" type="submit">Sign In</button>
                  <button routerLink="/signup" class="btn btn-link" [disabled]="loading">Sign Up</button>
              </div>
          </form>
      </div>    `,
  styles : [css, commonCss]
})
export class SignInComponent {

  loading : boolean;
  email : string;
  password : string;
  error : boolean = false;
  texts = {
    error : "Sign in failed. Please, check your email or password."
  };

  constructor(@Inject(AuthService) private auth : AuthService,
              @Inject(Router) private router : Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.auth.signIn({email : this.email, password :this.password})
      .then(({result}) => {
        this.error = false;
        this.loading = false;
        if (result) {
          this.auth.getUser()
            .then(user => user.storages.google ? this.router.navigate(["storages"]) : this.router.navigate(["storages"]));
        }
        else {
          this.error = true;
        }
      })
  }

}