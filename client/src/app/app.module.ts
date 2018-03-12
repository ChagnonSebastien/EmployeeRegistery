import { ServerRequestService } from './server-request.service';
import { AuthentificationService } from './authentification.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';

import { AppComponent } from './app.component';
import { RegisteryComponent } from './registery/registery.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RegisteryComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModules.forRoot(),
    FormsModule
  ],
  providers: [
    MDBSpinningPreloader,
    AuthentificationService,
    ServerRequestService
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
