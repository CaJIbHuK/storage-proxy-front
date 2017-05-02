import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {SharedModule} from "shared/shared.module";
import NgbModule from "@ng-bootstrap/ng-bootstrap";

import * as COMPONENTS from "./components/index";
const components = Object.keys(COMPONENTS).map(key => COMPONENTS[key]);

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule.NgbModule,
    SharedModule
  ],
  providers : [
  ],
  declarations : [
    components
  ],
  exports : [
    components
  ]
})
export class StoragesModule {}
