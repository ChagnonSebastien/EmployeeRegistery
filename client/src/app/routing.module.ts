import { Routes, RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { RegisteryComponent } from './registery/registery.component';
import { EmployeeZoneComponent } from './registery/employee-zone/employee-zone.component';
import { EmployeeInfoComponent } from './registery/employee-zone/employee-info/employee-info.component';
import { EmployeeSalaryComponent } from './registery/employee-zone/employee-salary/employee-salary.component';

const appRoutes: Routes = [
    { path: 'registery', component: RegisteryComponent, children: [
        { path: 'employee/:id', component: EmployeeZoneComponent, children: [
            { path: 'infos', component: EmployeeInfoComponent },
            { path: 'salaries', component: EmployeeSalaryComponent },
            { path: '**', redirectTo: 'infos'}
        ] }
    ]},
    { path: '**', redirectTo: 'registery'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
