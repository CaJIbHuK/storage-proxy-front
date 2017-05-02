import {Component, Input, Inject} from "@angular/core";
import css from "./google.component.css!text";

@Component({
  selector : 'google',
  template : `
    <div class="google-storage">
      <storage-side-navigation></storage-side-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles : [css]
})
export class GoogleComponent {}
