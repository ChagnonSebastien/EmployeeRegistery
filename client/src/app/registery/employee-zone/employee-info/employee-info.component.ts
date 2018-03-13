import { ServerRequestService } from './../../../server-request.service';
import { EmployeeService } from './../../employee-select.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Employee } from '../../employee';
import { InputDecorator } from '@angular/core/src/metadata/directives';
import { IMyOptions, MDBDatePickerComponent } from 'ng-mdb-pro/pro';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {

  public optionsSelect: Array<any>;
  public employee: Employee;

  public myDatePickerOptions: IMyOptions = {
    dayLabels: {su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam'},
    dayLabelsFull: {su: 'Dimanche', mo: 'Lundi', tu: 'Mardi', we: 'Mercredi', th: 'Jeudi', fr: 'Vendredi', sa: 'Samedi'},
    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mars', 4: 'Avr', 5: 'Mai', 6: 'Juin', 7: 'Juil', 8: 'Aout', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
    },
    monthLabelsFull: {
      1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
      5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Aout',
      9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
    },
    todayBtnTxt: 'Aujourd\'hui',
    clearBtnTxt: 'Effacer',
    closeBtnTxt: 'Fermer',
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'su',
    minYear: 1900,
    maxYear: 2100,
  };

  @ViewChild('nasField') public nasField: ElementRef;

  constructor(private employeeService: EmployeeService, private serverRequestService: ServerRequestService) {
    this.optionsSelect = [{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}];
  }

  ngOnInit() {
    this.employeeService.getSelectedObservable().subscribe((employee: Employee) => {
      this.employee = employee;
    });

    this.serverRequestService
    .get('/employees/types')
    .then(res => {
      this.optionsSelect = res.json().map((type: any) => {
        return {value: type._id, label: type.name, disabled: !type.isSuperior && type._id !== this.employee.employeeType};
      });
    })
    .catch(err => this.optionsSelect = []);
  }

  public toogleVisibility(): void {
    if (this.nasField.nativeElement.type === 'password') {
      this.nasField.nativeElement.type = 'text';
    } else {
      this.nasField.nativeElement.type = 'password';
    }
  }

  public save(): void {
    this.serverRequestService
    .post('/employees/' + this.employee._id, this.employee)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

}
