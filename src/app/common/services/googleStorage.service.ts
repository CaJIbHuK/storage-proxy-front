import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "./api.service";

@Injectable()
export class GoogleStorageService {

  constructor(@Inject(HttpClient) private http : HttpClient) {}

  getAccess() : Promise<void> {
    return this.http.get<{link}>('storages/google/access')
      .then(({link}) => {open(link)});
  }

}