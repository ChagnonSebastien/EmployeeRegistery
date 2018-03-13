import { Subscription } from 'rxjs/Subscription';
import { EmployeeService } from './../employee-select.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-employee-zone',
  templateUrl: './employee-zone.component.html',
  styleUrls: ['./employee-zone.component.scss']
})
export class EmployeeZoneComponent implements OnInit, OnDestroy {

  private idSubscription: Subscription;

  constructor(private route: ActivatedRoute, private employeeSelectService: EmployeeService) {}

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe(params => {
      this.employeeSelectService.updateSelected(Number(params.id));
    });
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }

}
