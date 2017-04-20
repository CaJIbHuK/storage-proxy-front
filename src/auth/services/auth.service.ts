import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "app/common/services/api.service";
import {AuthInfo, User} from "../models/auth.models";

@Injectable()
export class AuthService {

  user : User = null;

  constructor(@Inject(HttpClient) private http : HttpClient) {}

  signIn(authInfo : AuthInfo) {
    return this.http.post('auth/signin', authInfo)
      .then(result => {
        console.log(result);
        this.user = new User(result);
        this.http.setAuthHeader(this.user.token);
        console.log(this.user);
      });
  }

}