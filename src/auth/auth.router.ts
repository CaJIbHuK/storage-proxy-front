import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent, SignUpComponent, StoragesComponent} from "./components/index";
import {AuthGuard} from 'app/common/guards/index';

const authRoutes : Routes = [
  {path : 'signin', component : SignInComponent},
  {path : 'signup', component : SignUpComponent},
  {path : 'storages', component : StoragesComponent, canActivate : [AuthGuard]},
];

@NgModule({
  imports : [
    RouterModule.forChild(authRoutes)
  ],
  exports : [
    RouterModule
  ]
})
export class AuthRoutingModule {
}