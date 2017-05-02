import {Inject, Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from "app/common/services/index";

@Injectable()
export class GoogleAccessGuard implements CanActivate {

  constructor(@Inject(Router) private router : Router,
              @Inject(AuthService) private authService : AuthService
  ) {
  }

  canActivate() : Promise<boolean> {
    return this.authService.getUser()
      .then(user => {
        if (!user) {
          this.router.navigate(['/signin']);
          return false;
        } else {
          let hasAccessToGoogle = user.storages.google;
          if (!hasAccessToGoogle) this.router.navigate(['/storages']);
          return hasAccessToGoogle;
        }
      })
  }
}