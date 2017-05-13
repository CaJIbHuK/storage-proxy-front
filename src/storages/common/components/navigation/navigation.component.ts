import {Component, Input, Inject, Output, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {IStorageService, StorageFile} from "app/common/models/storage.models";
import {FileInfoModalComponent} from "../index";
import NgbModule, {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {GoogleStorageService} from "app/common/services/index";
import css from "./navigation.component.css!text";

@Component({
  selector : 'storage-side-navigation',
  template : `
      <nav class="bg-faded sidebar">
          <ul class="nav nav-pills flex-column">
              <li class="nav-item" routerLinkActive="active-sidebar-item">
                  <button [routerLink]="links[storage].drive" class="btn btn-link" [disabled]="loading">My Drive</button>
              </li>
          </ul>
          <hr>
      </nav>

  `,
  styles : [css]
})
export class StorageSideNavigationComponent implements OnInit {
  @Input() storage : string;
  storageService : IStorageService = null;
  files : StorageFile[] = [];
  links : any = {
    google : {
      drive : '/google/drive'
    }
  };

  constructor(@Inject(GoogleStorageService) private google : GoogleStorageService) {
  }

  ngOnInit() : void {
    if (this.storage === "google") this.storageService = this.google;
    else throw new Error("Invalid storage type");
  }
}