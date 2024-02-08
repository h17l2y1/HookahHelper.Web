import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent implements OnInit {
  public checked: boolean = true;
  public isAdmin: boolean = false;
  public countryControl: FormControl = this.formBuilder.control('');
  public brandFilterForm: FormGroup = this.initBrandFilterForm();
  public filter$ = this.brandFilterForm.valueChanges;

  constructor(
    public roleService: RoleService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.roleService.getUserData.subscribe(userData => {
      this.isAdmin = userData.isAdmin;
    })
  }

  private initBrandFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: null,
      brandId: null,
      countryId: this.countryControl
    });
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(BrandCreateComponent, {
      data: null,
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.brandFilterForm.reset();
      }
    });
  }


}
