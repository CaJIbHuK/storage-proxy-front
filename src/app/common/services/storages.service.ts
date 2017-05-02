import {Injectable, Inject} from "@angular/core";
import {Router} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable()
export class StoragesService {

  routes =  {
    google : '/google',
    default : '/storages'
  };

  constructor(@Inject(Router) private router : Router,
              @Inject(AuthService) private authService : AuthService,
  ) {}

  openStorage(storage? : string) {
    return this.authService.getUser()
      .then(user => {
        if (user.hasAccessedStorages()) {
          if (this.routes[storage]) return this.router.navigate([this.routes[storage]]);
          else {
            let accessedStorage = Object.keys(user.storages).find(storage => user.storages[storage]);
            return this.router.navigate([this.routes[accessedStorage]]);
          }
        } else {
          return this.router.navigate([this.routes.default]);
        }
      });
  }

}