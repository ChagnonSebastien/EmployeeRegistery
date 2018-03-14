import { EmployeeTypeService } from './employee-type.service';
import { AuthentificationService } from './../authentification.service';
import { EmployeeService } from './employee-select.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from './employee';
import { json } from 'body-parser';
import { ServerRequestService } from './../server-request.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { last } from '@angular/router/src/utils/collection';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { ModalDirective } from 'ng-mdb-pro/free';

@Component({
  selector: 'app-registery',
  templateUrl: './registery.component.html',
  styleUrls: ['./registery.component.scss']
})
export class RegisteryComponent implements OnInit, OnDestroy {
  public keyWord: string;
  public activeOnly: boolean;
  public filteredEmployees: Employee[];

  public optionsSelect: Array<any>;
  public newEmployee: Employee;

  public currentlySelectedEmployee: Number;
  private idSubscription: Subscription;
  private listUpdateSubscription: Subscription;

  @ViewChild('newId') private newIdInput: ElementRef;
  @ViewChild('newEmployeeForm') private newEmployeeForm: ModalDirective;

  constructor(
    private serverRequestService: ServerRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeSelectService: EmployeeService,
    private toastrService: ToastService,
    private authenticationService: AuthentificationService,
    private employeeTypeService: EmployeeTypeService
  ) {
    this.filteredEmployees = [];
    this.activeOnly = true;
    this.keyWord = '';
    this.newEmployee = new Employee(Number(''));
  }

  public ngOnInit() {
    this.employeeSelectService.downloadEmployees().then().catch();

    this.listUpdateSubscription = this.employeeSelectService.getListUpdatedObservable().subscribe((employees: Employee[]) => {
      this.filterEmployees(employees);
    });

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

  private refilter(): void {
    this.employeeSelectService.fetchEmployees()
    .then((employees: Employee[]) => this.filterEmployees(employees))
    .catch(err => console.log(err));
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

  public generateNextEmployee() {
    this.employeeTypeService.fetchEmployeeTypes()
    .then(res => this.optionsSelect = res)
    .catch(err => {
      this.toastrService.error('Erreur lors de la requête vers le serveur');
      this.newEmployeeForm.hide();
    });

    this.serverRequestService.get('/employees/nextCode')
    .then(res => this.newEmployee = new Employee(res.json().next))
    .catch(err => {
      if (err.status === 401) {
        this.toastrService.warning('Session expirée');
        this.authenticationService.expire();
      } else {
        console.log(err);
        this.newEmployee = new Employee(Number(''));
      }
    });
  }

  public createNewEmployee(): void {
    this.newEmployee._id = Number(this.newEmployee._id);
    if (this.newEmployee._id === NaN || this.newEmployee._id === undefined) {
      this.toastrService.warning('Le code doit être un chiffre');
      return;
    }

    if (this.newEmployee.employeeType === undefined) {
      this.toastrService.warning('Le type d\'employé doit être sélectionné');
      return;
    }

    if (this.newEmployee.firstName === '' || this.newEmployee.lastName === '') {
      this.toastrService.warning('Le nom du nouvel employé doit être complet');
      return;
    }

    this.serverRequestService.put('/employees/' + this.newEmployee._id, this.newEmployee)
    .then(res => {
      this.employeeSelectService.updateEmployee(res.json());
      this.newEmployeeForm.hide();
      this.toastrService.success('Succès');
      this.router.navigate(['employee', res.json()._id], {relativeTo: this.route});
    })
    .catch(err => {
      if (err.status === 401) {
        this.toastrService.warning('Session expirée');
        this.authenticationService.expire();
      }

      this.toastrService.warning('Problème lors de la sauvegarde');
    });
  }

}
