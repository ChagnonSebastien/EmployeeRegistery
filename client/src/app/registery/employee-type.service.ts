import { AuthentificationService } from './../authentification.service';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { ServerRequestService } from './../server-request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeTypeService {

  private optionsSelect: Array<any>;

  constructor(
    private serverRequestService: ServerRequestService,
    private toastrService: ToastService,
    private authenticationService: AuthentificationService
  ) {}

  public fetchEmployeeTypes(): Promise<Array<any>> {
    return new Promise<any>((resolve, reject) => {
      if (this.optionsSelect) {
        resolve(this.optionsSelect);
        return;
      }

      this.serverRequestService.get('/employeetypes')
      .then(res => {
        this.optionsSelect = res.json().map((type: any) => {
          return {value: type._id, label: type.name};
        });
        resolve(this.optionsSelect);
      })
      .catch(err => {
        if (err.status === 401) {
          this.toastrService.warning('Session expirée');
          this.authenticationService.expire();
        } else {
          reject();
        }
      });
    });
  }

}
