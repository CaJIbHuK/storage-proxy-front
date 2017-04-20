
export interface AuthInfo {
  email : string;
  password : string;
}

export class User {

  name : string;
  token : string;

  constructor({token}) {
    this.token = token;
  }

}