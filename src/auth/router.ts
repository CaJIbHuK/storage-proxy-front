import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent, SignUpComponent} from "./components/index";

const authRoutes : Routes = [
  {path : 'signin', component : SignInComponent},
  {path : 'signup', component : SignUpComponent},
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