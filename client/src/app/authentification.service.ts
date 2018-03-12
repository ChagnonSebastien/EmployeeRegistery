import { SERVER_HTTPS, SERVER_URL, SERVER_PORT } from './config';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Resolve } from '@angular/router';

@Injectable()
export class AuthentificationService {

  private token: string;

  constructor(private http: Http) {}

  public getToken(): string {
    return this.token;
  }

  public authenticate(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
      .post(
        `${SERVER_HTTPS ? 'https' : 'http'}://${SERVER_URL}:${SERVER_PORT}/login`,
        { email, password }
      )
      .toPromise()
      .then(res => {
        this.token = res.json().token;
        resolve(true);
      })
      .catch(err => resolve(false));
    });
  }

}
