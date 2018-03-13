import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { AuthentificationService } from './authentification.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public email: string;
  public password: string;

  public authenticated = false;
  public expirationListener: Subscription;

  constructor(private authentificationService: AuthentificationService) {

  }

  public ngOnInit() {
    this.expirationListener = this.authentificationService.getExporationObservable().subscribe(() => this.authenticated = false);
  }

  public ngOnDestroy() {
    this.expirationListener.unsubscribe();
  }

  public connect(): void {
    this.authentificationService
    .authenticate(this.email.trim(), this.password)
    .then((authenticated: boolean) => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.password = '';
      }
    })
    .catch(err => console.log(err));
  }
}
