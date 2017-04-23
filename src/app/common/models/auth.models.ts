
export interface AuthInfo {
  name? :string;
  email : string;
  password : string;
}

export class User {

  name : string;
  email : string;
  storages : {google : boolean};

  constructor({name, email, storages}) {
    this.name = name || "";
    this.email = email || "";
    this.storages = storages || {};
  }

}