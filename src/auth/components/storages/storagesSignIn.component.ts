import {Component, Inject} from "@angular/core";
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
              <div class="storage google-logo" (click)="googleSignIn()"></div>
          </div>
      </div>    `,
  styles : [css, commonCss]
})
export class StoragesComponent {

  //TODO disable click and show check symbol for already accessed storages
  storages : {google : boolean};

  constructor(@Inject(AuthService) private authService : AuthService,
              @Inject(GoogleStorageService) private google : GoogleStorageService,
  ) {
    this.authService.getUser()
      .then(user => this.storages = user.storages)
  }

  googleSignIn() {
    this.google.getAccess();
  }

}