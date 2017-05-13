import {Inject, Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from "app/common/services/index";
import {AuthGuard} from "app/common/guards/index";

@Injectable()
export class GoogleAccessGuard implements CanActivate {

  constructor(@Inject(Router) private router : Router,
              @Inject(AuthService) private authService : AuthService,
              @Inject(AuthGuard) private authGuard: AuthGuard
  ) {
  }

  canActivate() : Promise<boolean> {
    return this.authGuard.canActivate()
      .then(isAuthed => isAuthed && this.authService.getUser())
      .then(user => {
        if (!user) return false;
        let hasAccessToGoogle = user.storages.google;
        if (!hasAccessToGoogle) this.router.navigate(['/storages']);
        return hasAccessToGoogle;
      })
  }
}