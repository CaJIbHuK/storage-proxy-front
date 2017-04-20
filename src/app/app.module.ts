import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from "./app.router";
import {AppComponent}  from './app.component';

import {AuthModule} from "auth/auth.module";

import  * as COMMON_SERVICES from "./common/services/index";
const commonServices = Object.keys(COMMON_SERVICES).map(key => COMMON_SERVICES[key]);

import  * as COMMON_COMPONENTS from "./common/components/index";
const commonComponents = Object.keys(COMMON_COMPONENTS).map(key => COMMON_COMPONENTS[key]);

@NgModule({
  imports : [
    BrowserModule,
    HttpModule,
    AuthModule,
    AppRoutingModule
  ],
  declarations : [
    AppComponent,
    commonComponents
  ],
  providers : [
    commonServices,
  ],
  bootstrap : [
    AppComponent
  ]
})
export class AppModule {
}