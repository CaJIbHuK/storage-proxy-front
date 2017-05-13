import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {GoogleStorageService} from "app/common/services/googleStorage.service";
import {AuthService} from "app/common/services/auth.service";
import css from "./storagesSignIn.component.css!text";
import commonCss from "../common/auth.component.css!text";

@Component({
  selector : 'storages-signin',
  template : `
      <div class="container modal-auth-container">
          <h2>Choose storage to browse</h2>
          <div class="container storages">
              <div class="storage">
                <i *ngIf="storages.google" class="fa fa-check-circle check-badge" aria-hidden="true"></i>
                <div class="storage-logo google-logo" [ngClass]="{accessed : storages.google}" (click)="googleSignIn()"></div>
              </div>
          </div>
      </div>    `,
  styles : [css, commonCss]
})
export class StoragesComponent {

  storages = {google : false};

  storageRoutes = {
    google : "/google"
  };

  constructor(@Inject(AuthService) private authService : AuthService,
              @Inject(GoogleStorageService) private google : GoogleStorageService,
              @Inject(Router) private router : Router
  ) {
    this.authService.getUser()
      .then(user => this.storages = user.storages)
  }

  googleSignIn() {
    if (!this.storages.google) this.google.getAccess();
    else this.router.navigate([this.storageRoutes.google]);
  }

}