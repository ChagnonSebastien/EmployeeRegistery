import { Subject } from 'rxjs/Subject';
import { AuthentificationService } from './../authentification.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { json } from 'body-parser';
import { ServerRequestService } from './../server-request.service';
import { Employee } from './employee';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmployeeService {

  private employeeList: Employee[];
  private subject: BehaviorSubject<Employee>;

  private listUpdatad: Subject<void>;

  constructor(
    private serverRequestService: ServerRequestService,
    private toastrService: ToastService,
    private authenticationService: AuthentificationService
  ) {
    this.subject = new BehaviorSubject<Employee>(new Employee(-1));
    this.listUpdatad = new Subject<void>();
    this.employeeList = [];
  }

  public getListUpdatedObservable(): Observable<void> {
    return this.listUpdatad.asObservable();
  }

  public getSelectedObservable(): Observable<Employee> {
    return this.subject.asObservable();
  }

  public updateSelected(_id: Number): void {
    this.serverRequestService.get('/employees/' + _id)
    .then(res => this.subject.next(res.json()))
    .catch(err => {
      if (err.status === 401) {
        this.toastrService.warning('Session expirée');
        this.authenticationService.expire();
      } else {
        this.toastrService.error('Erreur lors du téléchargement de l\'employé ' + _id + '.');
        this.subject.next(new Employee(_id));
      }
    });
  }

  public updateEmployee(employee: Employee): void {
    this.employeeList = this.employeeList.map((e: Employee) => {
      return e._id === employee._id ? JSON.parse(JSON.stringify(employee)) : e;
    });
    this.listUpdatad.next();
  }

  public fetchEmployees(): Promise<Employee[]> {
    return new Promise<Employee[]>((resolve, reject) => {
      if (this.employeeList.length > 0) {
        resolve(this.employeeList);
      }

      this.serverRequestService.get('/employees')
      .then(res => {
        this.employeeList = res.json().sort((e1, e2) => {
          return e1._id > e2._id;
        });
        resolve(this.employeeList);
      })
      .catch(err => {
        if (err.status === 401) {
          this.toastrService.warning('Session expirée');
          this.authenticationService.expire();
        } else {
          this.toastrService.error('Erreur lors du téléchargement des employés.');
          resolve([]);
        }
      });
    });
  }
}
