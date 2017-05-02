import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/common/guards/index';
import {GoogleAccessGuard} from "./guards/index";
import {GoogleComponent, GoogleFilesComponent} from "./components/index";

const googleStorageRoutes : Routes = [
  {path : 'google', component : GoogleComponent, canActivate : [AuthGuard, GoogleAccessGuard],
    children : [
      {path : '', component : GoogleFilesComponent},
    ]
  },
];

@NgModule({
  imports : [
    RouterModule.forChild(googleStorageRoutes)
  ],
  exports : [
    RouterModule
  ]
})
export class GoogleStorageRoutingModule {
}