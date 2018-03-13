import { EmployeeService } from './registery/employee-select.service';
import { ActivatedRoute } from '@angular/router';
import { ServerRequestService } from './server-request.service';
import { AuthentificationService } from './authentification.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';

import { AppComponent } from './app.component';
import { RegisteryComponent } from './registery/registery.component';
import { FormsModule } from '@angular/forms';
import { EmployeeZoneComponent } from './registery/employee-zone/employee-zone.component';
import { AppRoutingModule } from './routing.module';
import { EmployeeSalaryComponent } from './registery/employee-zone/employee-salary/employee-salary.component';
import { EmployeeInfoComponent } from './registery/employee-zone/employee-info/employee-info.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisteryComponent,
    EmployeeZoneComponent,
    EmployeeInfoComponent,
    EmployeeSalaryComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModules.forRoot(),
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    MDBSpinningPreloader,
    AuthentificationService,
    ServerRequestService,
    EmployeeService
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
