import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import NgbModule from "@ng-bootstrap/ng-bootstrap";
import {StoragesModule} from "storages/common/storages.module";
import {GoogleStorageRoutingModule} from "./google.router";

import * as COMPONENTS from "./components/index";
const components = Object.keys(COMPONENTS).map(key => COMPONENTS[key]);

import * as GUARDS from "./guards/index";
const guards = Object.keys(GUARDS).map(key => GUARDS[key]);

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    NgbModule.NgbModule,
    StoragesModule,
    GoogleStorageRoutingModule
  ],
  providers : [
    guards
  ],
  declarations : [
    components
  ],
  exports : []
})
export class GoogleStorageModule {}
