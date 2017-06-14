import {Component, Input, Inject} from "@angular/core";
import css from "./google.component.css!text";

@Component({
  selector : 'google',
  template : `
    <navigation-bar></navigation-bar>
    <div class="google-storage">
      <storage-side-navigation [storage]="'google'"></storage-side-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles : [css]
})
export class GoogleComponent {}
