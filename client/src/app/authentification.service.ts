import { Observable } from 'rxjs/Observable';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { SERVER_HTTPS, SERVER_URL, SERVER_PORT } from './config';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Resolve } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthentificationService {

  private token: string;
  private expiration: Subject<void>;

  constructor(private http: Http, private toastrService: ToastService) {
    this.expiration = new Subject<void>();
  }

  public getToken(): string {
    return this.token;
  }

  public getExporationObservable(): Observable<void> {
    return this.expiration.asObservable();
  }

  public expire() {
    this.token = undefined;
    this.expiration.next();
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
      .catch(err => {
        this.toastrService.error('Mauvais email ou mot de passe');
        resolve(false);
      });
    });
  }

}
