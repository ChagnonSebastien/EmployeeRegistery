import { AuthentificationService } from './authentification.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public email: string;
  public password: string;

  public authenticated = false;

  constructor(private authentificationService: AuthentificationService) {

  }

  public connect(): void {
    this.authentificationService
    .authenticate(this.email, this.password)
    .then((authenticated: boolean) => this.authenticated = authenticated);
  }
}
