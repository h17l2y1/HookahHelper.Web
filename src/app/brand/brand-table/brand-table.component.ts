import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {tap} from "rxjs";


@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent extends UserPermission implements OnInit {
  public readonly brandTableKey: string = 'brand_table_state';
  public countryControl: FormControl = this.formBuilder.control('');
  public brandFilterForm: FormGroup = this.initBrandFilterForm();
  public filter$ = this.brandFilterForm.valueChanges;
  public isTableViewCard: boolean = true;
  protected readonly TableTypes = TableTypes;
  public isMobileMode!: boolean;

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver) {
    super(userDataService);
    this.breakpointObserver.observe(["(max-width: 768px)"]).pipe(
      tap((result: BreakpointState) => {
        if (result.matches) {
          this.isMobileMode = result.matches;
        } else {
          this.isMobileMode = result.matches;
        }
      })
    ).subscribe();
  }

  ngOnInit(): void {
    const tableType: TableTypes = this.getTableState();
    this.isTableViewCard = tableType === TableTypes.Card;
  }

  public switchTableView(type: TableTypes): boolean {
    localStorage.setItem(this.brandTableKey, type);

    this.isTableViewCard = type === TableTypes.Card
    return this.isTableViewCard;
  }

  private getTableState(): TableTypes {
    const type = localStorage.getItem(this.brandTableKey);
    if (!type){
      localStorage.setItem(this.brandTableKey, TableTypes.Card);
      return TableTypes.Card
    }
    return type as TableTypes;
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

  private initBrandFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: null,
      brandId: null,
      countryId: this.countryControl
    });
  }

}
