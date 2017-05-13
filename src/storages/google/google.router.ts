import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/common/guards/index';
import {GoogleAccessGuard} from "./guards/index";
import {GoogleComponent, GoogleFilesComponent} from "./components/index";

const googleStorageRoutes : Routes = [
  {path : 'google', component : GoogleComponent, canActivate : [GoogleAccessGuard],
    children : [
      {path : '', redirectTo: 'drive', pathMatch: 'full'},
      {path : 'drive', children : [
        {path : '', redirectTo : 'root', pathMatch : 'full'},
        {path : ':id', component : GoogleFilesComponent},
      ]},
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