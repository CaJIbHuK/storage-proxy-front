import {Component, Input, Inject, Output} from "@angular/core";
import css from "./navigation.component.css!text";

@Component({
  selector : 'storage-side-navigation',
  template : `
      <nav class="bg-faded sidebar">
          <ul class="nav nav-pills flex-column">
              <li class="nav-item" routerLinkActive="active-sidebar-item">
                  <button routerLink="/google" class="btn btn-link" [disabled]="loading">My Drive</button>
              </li>
          </ul>
          <hr>
      </nav>

  `,
  styles : [css]
})
export class StorageSideNavigationComponent {}