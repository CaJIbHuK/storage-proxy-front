import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthRoutingModule} from "./router";

import * as COMPONENTS from "./components/index";
const components = Object.keys(COMPONENTS).map(key => COMPONENTS[key]);

import * as SERVICES from "./services/index";
const services = Object.keys(SERVICES).map(key => SERVICES[key]);


@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  providers : [
    services
  ],
  declarations : [
    components
  ],
  exports : []
})
export class AuthModule {}
