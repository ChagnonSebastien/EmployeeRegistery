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

  constructor(private serverRequestService: ServerRequestService) {
    this.subject = new BehaviorSubject<Employee>(new Employee(-1));
    this.employeeList = [];
  }

  public getSelectedObservable(): Observable<Employee> {
    return this.subject.asObservable();
  }

  public updateSelected(_id: Number): void {
    this.subject.next(this.findEmployee(_id));
  }

  private findEmployee(_id: Number): Employee {
    const found = this.employeeList.find((employee: Employee) => {
      return employee._id === _id;
    });

    if (found) {
      return found;
    } else {
      return new Employee(_id);
    }
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
      .catch(err => resolve([]));
    });
  }

  public reloadSelected() {
    this.subject.next(this.findEmployee(this.subject.value._id));
  }
}
