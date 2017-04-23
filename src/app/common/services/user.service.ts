import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "./api.service";
import {User} from "../models/auth.models";

@Injectable()
export class UserService {

  constructor(@Inject(HttpClient) private http : HttpClient) {}

  getMe() : Promise<User> {
    return this.http.get<User>('users/me')
      .then(result => new User(result));
  }

}