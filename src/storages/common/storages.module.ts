import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {ContextmenuModule} from "ng2-contextmenu";
import FileUploadModule from 'ng2-file-upload';
import {SharedModule} from "shared/shared.module";
import NgbModule from "@ng-bootstrap/ng-bootstrap";

import * as COMPONENTS from "./components/index";
const components = Object.keys(COMPONENTS).map(key => COMPONENTS[key]);

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule.NgbModalModule,
    NgbModule.NgbCollapseModule,
    FileUploadModule.FileUploadModule,
    ContextmenuModule,
    SharedModule
  ],
  providers : [
  ],
  entryComponents : [
    COMPONENTS.FileInfoModalComponent
  ],
  declarations : [
    components
  ],
  exports : [
    components
  ]
})
export class StoragesModule {}
