import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import  * as COMMON_PIPES from "./pipes/index";
const commonPipes = Object.keys(COMMON_PIPES).map(key => COMMON_PIPES[key]);

@NgModule({
  imports : [
    CommonModule
  ],
  declarations : [
    commonPipes
  ],
  providers : [
    commonPipes
  ],
  exports : [
    commonPipes
  ]
})
export class SharedModule {}