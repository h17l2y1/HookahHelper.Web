import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {debounceTime, distinctUntilChanged, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {ActivatedRoute, Router} from "@angular/router";
import {Filter} from "../../interfaces/models/filter";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent extends UserPermission implements OnInit {
  public readonly brandTableKey: string = 'brand_table_state';
  public countries: Country[] = this.route.snapshot.data['countries'];
  public filter: Filter = this.route.snapshot.data['queryParam'];
  public countriesOptionsFiltered: Country[] = this.countries.slice();
  public nameControl: FormControl = this.formBuilder.control(this.filter.name);
  public countryControl: FormControl = this.formBuilder.control(this.countries.find(x => x.id === this.filter.countryId));
  public brandFilterForm: FormGroup = this.initBrandFilterForm();
  protected readonly TableTypes = TableTypes;
  public isTableViewCard: boolean = true;
  public isMobileMode!: boolean;

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver) {
    super(userDataService);
    this.breakpointObserver.observe(["(max-width: 767px)"]).pipe(
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

    this.nameControl.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(() => this.redirect());

    this.countryControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.countriesOptionsFiltered = this._filter(this.countries, value);
          return;
        }
        this.redirect()
      })
    ).subscribe();
  }

  private redirect(): void {
    this.router.navigate(['/brands/'], {
      queryParams: {
        name: this.nameControl.value,
        countryId: this.countryControl.value?.id,
      }
    });
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public displayFn(country: { name: string }): string {
    return country && country.name ? country.name : '';
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
        this.redirect();
      }
    });
  }

  private initBrandFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: this.nameControl,
      countryId: this.countryControl
    });
  }

}
