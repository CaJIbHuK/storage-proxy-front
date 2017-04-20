import {Injectable, Inject} from '@angular/core';
import {Http, Headers, Response, RequestOptions, RequestMethod} from '@angular/http';

function promisify<T>(cb : any) : Promise<T> {
  return new Promise((res, rej) => {
    let value = null;
    cb.subscribe(
      response => value = response,
      error => rej(error),
      () => res(value))
  });
}

interface RequestParams {
  method : RequestMethod;
  url : string;
  data? : any;
  options? : RequestOptions;
}


@Injectable()
export class HttpClient {

  //TODO move to cfg
  //TODO configurable through env
  apiUrl : string = 'http://localhost:3000/api/v1';
  headers : Headers = null;

  constructor(@Inject(Http) private http : Http) {
    this.fillHeaders();
  }

  private fillHeaders() {
    const DEFAULT_HEADERS = {
      'Content-type' : 'application/json'
    };

    this.headers = new Headers();
    for (let header of Object.keys(DEFAULT_HEADERS)) {
      this.headers.append(header, DEFAULT_HEADERS[header])
    }
  }

  setAuthHeader(token : string) {
    this.headers.append('Authorization', `Bearer ${token}`);
  }

  private getHeaders() {
    if (!this.headers) this.fillHeaders();
    return this.headers;
  }

  private getRequestOptions() {
    let headers = this.getHeaders();
    return new RequestOptions({headers : headers});
  }

  private extractData(res : Response) {
    let body;
    try {
      body = res.json()
    } catch (err) {
      body = res;
    }

    return body || {};
  }

  private handleError(errorResponse : Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let error = null;
    try {
      error = errorResponse.json();
    } catch(err) {
      error = errorResponse.text();
    }
    console.error(JSON.stringify(error));
    throw new Error(error);
  }

  private makeRequest(params : RequestParams) : Promise<object> {
    let defaultOpts = this.getRequestOptions();
    let opts : RequestOptions = Object.assign({}, defaultOpts, {method : params.method});
    if (params.data) opts.body = params.data;
    if (params.options) opts = Object.assign({}, opts, params.options);

    return promisify<Response>(this.http.request(`${this.apiUrl}/${params.url}`, opts))
      .then(response => this.extractData(response))
      .catch(error => this.handleError(error));
  }


  get(url : string, data? : any) {
    return this.makeRequest({method : RequestMethod.Get, url : url, data : data || null});
  }

  post(url : string, data : any = {}) {
    return this.makeRequest({method : RequestMethod.Post, url : url, data : data});
  }

  put(url : string, data : any = {}) {
    return this.makeRequest({method : RequestMethod.Put, url : url, data : data});
  }

  delete(url : string) {
    return this.makeRequest({method : RequestMethod.Delete, url : url});
  }


}