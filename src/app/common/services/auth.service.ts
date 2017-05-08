import {Injectable, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient} from "./api.service";
import {UserService} from "./user.service";
import {AuthInfo, User} from "../models/auth.models";

@Injectable()
export class AuthService {

  initComplete = false;

  TOKEN_NAME = "token";
  token : string;
  user : User;

  constructor(@Inject(HttpClient) private http : HttpClient,
              @Inject(UserService) private userService : UserService,
              @Inject(Router) private router : Router,
  ) {}

  getToken() : Promise<string|null> {
    return Promise.resolve(this.token || null);
  }

  setToken(token : string | null) : Promise<void> {
    return Promise.resolve(token)
      .then(token => {
        if (token) {
          this.token = token;
          localStorage.setItem(this.TOKEN_NAME, token);
          this.http.setAuthHeader(token);
        } else {
          this.token = null;
          localStorage.removeItem(this.TOKEN_NAME);
          this.http.removeAuthHeader();
        }
      });
  }

  getUser() : Promise<User|null> {
    return Promise.resolve(this.user || null);
  }

  setUser(user) : Promise<void> {
    return Promise.resolve(user)
      .then(user => {this.user = user});
  }

  reset() {
    this.initComplete = false;
    return Promise.all([
      this.setToken(null),
      this.setUser(null)
    ]).then(() => Promise.resolve());
  }

  refreshUser() : Promise<User> {
    return this.userService.getMe()
      .then(user => user ? this.setUser(user) : Promise.reject(new Error('Bad auth token')))
      .then(() => this.getUser());
  }

  isAuthenticated() : Promise<boolean> {
    return this.getToken().then(token => !!token);
  }

  init(force = false) {
    if (this.initComplete && !force) return Promise.resolve();
    return Promise.resolve(localStorage.getItem(this.TOKEN_NAME))
      .then(token => token ? this.setToken(token) : Promise.reject(new Error('No auth token')))
      .then(() => this.refreshUser())
      .then(() => this.initComplete = true)
      .catch(err => {
        console.error(err);
        return this.reset();
      })
  }

  signIn(authInfo : AuthInfo) : Promise<{result : boolean, errors? : {message : string}}> {
    return this.reset()
      .then(() => this.http.post<{token : string}>('auth/signin', authInfo))
      .then(result => this.setToken(result.token))
      .then(() => this.init(true))
      .then(() => this.isAuthenticated())
      .then(isAuthed => ({result : isAuthed}))
      .catch(errors => {
        this.reset();
        return ({result : false, errors : errors});
      });
  }

  signUp(authInfo : AuthInfo) : Promise<{result : boolean, errors? : {message : string}}> {
    return this.reset()
      .then(() => this.http.post<{token : string}>('auth/signup', authInfo))
      .then(result => this.setToken(result.token))
      .then(() => this.init(true))
      .then(() => this.isAuthenticated())
      .then(isAuthed => ({result : isAuthed}))
      .catch(errors => {
        this.reset();
        return ({result : false, errors : errors});
      });
  }

  signOut() : Promise<{result : boolean, errors? : {message : string}}> {
    return this.reset()
      .then(() => this.router.navigate(['/signin']))
      .then(() => ({result : true}))
      .catch(errors => ({result : false, errors : errors}))
  }

}