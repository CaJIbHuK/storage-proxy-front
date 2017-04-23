import {Inject, Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from "../services/index";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(@Inject(Router) private router : Router,
              @Inject(AuthService) private authService : AuthService) {
  }

  canActivate() : Promise<boolean> {
    return this.authService.init()
      .then(() => this.authService.isAuthenticated())
      .then(isAuthed => isAuthed ? this.authService.refreshUser().then(user => !!user) : false)
      .then(result => result || Promise.reject(new Error()))
      .catch((err) =>{
        console.log(err);
        this.router.navigate(['/signin']);
        return false;
      });
  }
}