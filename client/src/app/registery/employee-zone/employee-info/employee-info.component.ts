import { EmployeeTypeService } from './../../employee-type.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthentificationService } from './../../../authentification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerRequestService } from './../../../server-request.service';
import { EmployeeService } from './../../employee-select.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Employee } from '../../employee';
import { InputDecorator } from '@angular/core/src/metadata/directives';
import { IMyOptions, MDBDatePickerComponent } from 'ng-mdb-pro/pro';
import { ToastService } from 'ng-mdb-pro/pro/alerts';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {

  public optionsSelect: Array<any>;
  public employee: Employee;

  private listUpdateListener: Subscription;

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

  constructor(
    private employeeService: EmployeeService,
    private serverRequestService: ServerRequestService,
    private toastrService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthentificationService,
    private employeeTypeService: EmployeeTypeService
  ) {
    this.optionsSelect = [{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}];
  }

  ngOnInit() {
    this.employeeService.getSelectedObservable().subscribe((employee: Employee) => this.employee = employee);

    this.employeeTypeService.fetchEmployeeTypes()
    .then(res => this.optionsSelect = res)
    .catch(err => {
      this.toastrService.error('Erreur lors de la requête vers le serveur');
      this.router.navigate(['.'], {relativeTo: this.route.parent.parent});
    });
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
    .then(res => {
      this.toastrService.success('Succès');
      this.employeeService.updateEmployee(this.employee);
    })
    .catch(err => {
      if (err.status === 401) {
        this.toastrService.warning('Session expirée');
        this.authenticationService.expire();
      } else {
        this.toastrService.error('Tu n\'a pas la permission de faire cela');
      }
    });

  }

}
