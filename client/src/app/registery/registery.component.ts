import { EmployeeService } from './employee-select.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from './employee';
import { json } from 'body-parser';
import { ServerRequestService } from './../server-request.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-registery',
  templateUrl: './registery.component.html',
  styleUrls: ['./registery.component.scss']
})
export class RegisteryComponent implements OnInit, OnDestroy {
  public keyWord: string;
  public activeOnly: boolean;
  public filteredEmployees: Employee[];

  public currentlySelectedEmployee: Number;
  private idSubscription: Subscription;
  private listUpdateSubscription: Subscription;

  constructor(
    private serverRequestService: ServerRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeSelectService: EmployeeService
  ) {
    this.activeOnly = true;
    this.keyWord = '';
  }

  public ngOnInit() {
    this.employeeSelectService.fetchEmployees()
    .then((employees: Employee[]) => {
      this.filterEmployees(employees);
    })
    .catch(err => console.log(err));

    this.listUpdateSubscription = this.employeeSelectService.getListUpdatedObservable().subscribe(() => this.refilter());

    this.idSubscription = this.employeeSelectService.getSelectedObservable().subscribe((employee: Employee) => {
      if (employee) {
        this.currentlySelectedEmployee = employee._id;
      }
    });
  }

  public ngOnDestroy() {
    this.idSubscription.unsubscribe();
    this.listUpdateSubscription.unsubscribe();
  }

  public selectEmployee(_id: Number) {
    this.router.navigate(['employee', _id], {relativeTo: this.route});
  }

  private filterEmployees(employees: Employee[]): void {
    this.filteredEmployees = employees.filter((employee: Employee) => {
      if (this.activeOnly && !employee.active) {
        return false;
      }

      const _id = String(employee._id).toLowerCase();
      const firstName = employee.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const lastName = employee.lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const keyWord = this.keyWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      return _id.search(keyWord) > -1 || firstName.search(keyWord) > -1 || lastName.search(keyWord) > -1;
    });
  }

  public refilter() {
    this.employeeSelectService.fetchEmployees()
    .then((employees: Employee[]) => {
      this.filterEmployees(employees);
    })
    .catch(err => console.log(err));
  }

}
