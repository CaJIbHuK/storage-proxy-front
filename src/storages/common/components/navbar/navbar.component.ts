import {Component, Input, Inject, Output, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "app/common/services/auth.service";
import css from "./navbar.component.css!text";

@Component({
  selector : 'navigation-bar',
  template : `
      <nav class="navbar navbar-inverse bg-inverse">
        <ul class="navbar-nav ml-auto mt-2 mt-md-0">
            <li class="nav-item">
                <button class="btn btn-link" (click)="signOut()"><i class="fa fa-sign-out" aria-hidden="true"></i>Log Out</button>
            </li>
        </ul>
      </nav>
  `,
  styles : [css]
})
export class NavigationBarComponent implements OnInit {
  @Input() storage : string;

  constructor(@Inject(AuthService) private auth : AuthService) {}

  ngOnInit() : void {}

  signOut() {
    this.auth.signOut();
  }
}