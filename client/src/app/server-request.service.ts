import { Response } from 'express';
import { AuthentificationService } from './authentification.service';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { SERVER_HTTPS, SERVER_URL, SERVER_PORT } from './config';

@Injectable()
export class ServerRequestService {

  constructor(private http: Http, private authentificationService: AuthentificationService) { }

  public get(path: string): Promise<Response> {
    return this.http
    .get(
      `${SERVER_HTTPS ? 'https' : 'http'}://${SERVER_URL}:${SERVER_PORT}${path}`,
      { headers: new Headers({ 'x-access-token': this.authentificationService.getToken() }) }
    ).toPromise();
  }

  public post(path: string, data: Object): Promise<Response> {
    return this.http
    .post(
      `${SERVER_HTTPS ? 'https' : 'http'}://${SERVER_URL}:${SERVER_PORT}${path}`,
      data,
      { headers: new Headers({ 'x-access-token': this.authentificationService.getToken() }) }
    ).toPromise();
  }

  public put(path: string, data: Object): Promise<Response> {
    return this.http
    .put(
      `${SERVER_HTTPS ? 'https' : 'http'}://${SERVER_URL}:${SERVER_PORT}${path}`,
      data,
      { headers: new Headers({ 'x-access-token': this.authentificationService.getToken() }) }
    ).toPromise();
  }

  public delete(path: string): Promise<Response> {
    return this.http
    .delete(
      `${SERVER_HTTPS ? 'https' : 'http'}://${SERVER_URL}:${SERVER_PORT}${path}`,
      { headers: new Headers({ 'x-access-token': this.authentificationService.getToken() }) }
    ).toPromise();
  }

}
