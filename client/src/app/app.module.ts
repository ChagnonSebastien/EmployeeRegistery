import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';

import { AppComponent } from './app.component';
import { RegisteryComponent } from './registery/registery.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisteryComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModules.forRoot()
  ],
  providers: [
    MDBSpinningPreloader
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
