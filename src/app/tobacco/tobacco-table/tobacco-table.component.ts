import {Component, OnInit} from '@angular/core';
import {Filter} from "../../interfaces/models/filter";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, startWith, switchMap, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LineService} from "../../services/line.service";
import {ActivatedRoute} from "@angular/router";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {FilterSharedService} from "../filter-shared.service";
import {TobaccoOptions} from "../../interfaces/models/tobacco-options";
export interface OptionValue {
  value: number;
  description: string;
}
@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent extends UserPermission implements OnInit {
  public readonly tobaccoTableKey: string = 'tobacco_table_state';
  public readonly TableTypes = TableTypes;
  public brandId: string | null = this.route.snapshot.data['brandId'];
  public options: TobaccoOptions = this.route.snapshot.data['options'];
  public isTableViewCard: boolean = this.getTableState() === TableTypes.Card;
  public allBrandsOption: Brand[] = this.options.brands;
  public filteredBrandsOptions: Brand[] = this.options.brands;
  public allCountriesOption: Country[] = this.options.countries;
  public filteredCountriesOptions: Country[] = this.options.countries;
  public linesOption: Line[] = [];
  public brandControl: FormControl = this.formBuilder.control(this.brandId);
  public brandAutocompleteControl: FormControl = this.formBuilder.control('');
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public countyControl: FormControl = this.formBuilder.control('');
  public lineControl: FormControl = this.formBuilder.control({value: '', disabled: true});
  public tagControl: FormControl = this.formBuilder.control('');
  public isMobileMode!: boolean;
  public filterForm: FormGroup = this.initFilterForm();

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private lineService: LineService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private filterSharedService: FilterSharedService
  ) {
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
    // if (this.brandId) {
    //   const brand = this.allBrandsOption.find(x => x.id === this.brandId);
    //   this.brandAutocompleteControl.setValue(brand, {emitEvent: false});
    // }

    this.brandAutocompleteControl.valueChanges.pipe(
      tap((value: string | Brand) => {
        if (typeof value === 'string') {
          this.filteredBrandsOptions = this._filter(this.allBrandsOption, value);
          return;
        }
        this.brandControl.setValue(value?.id)
        this.filteredBrandsOptions = this.allBrandsOption.slice();
      }),
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      tap(value => {
        if (!value) {
          this.lineControl.setValue(null, {emitEvent: false});
          this.lineControl.disable({emitEvent: false});
        }
      }),
      filter(Boolean),
      switchMap(value => this.lineService.getLinesByBrandId(value)),
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable({emitEvent: false});
      })
    ).subscribe()

    this.countryAutocompleteControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.filteredCountriesOptions = this._filter(this.allCountriesOption, value);
          return;
        }
        this.countyControl.setValue(value?.id);
        this.filteredCountriesOptions = this.allCountriesOption.slice();
      }),
    ).subscribe();

    this.filterForm.valueChanges.pipe(
      tap((value: Filter) => {
        this.filterSharedService.setFilters(value);
      })
    ).subscribe();

    this.filterSharedService.getFilters.pipe(
      tap(value => {
        if (value.lineId){
          this.lineControl.enable({emitEvent: false});
        }
        this.filterForm.patchValue(value, {emitEvent: false});
        const country = this.allCountriesOption.find(x => x.id === value.countryId);
        this.countryAutocompleteControl.patchValue(country, {emitEvent: false});
        const brand = this.allBrandsOption.find(x => x.id === value.brandId);
        this.brandAutocompleteControl.patchValue(brand, {emitEvent: false});
      }),
      filter(value => value?.brandId !== null && value?.brandId !== undefined),
      switchMap(value => this.lineService.getLinesByBrandId(value.brandId)),
      tap(lines => this.linesOption = lines)
    ).subscribe();
  }

  public displayFn(brand: { name: string }): string {
    return brand && brand.name ? brand.name : '';
  }

  public switchTableView(type: TableTypes): boolean {
    localStorage.setItem(this.tobaccoTableKey, type);
    this.isTableViewCard = type === TableTypes.Card
    return this.isTableViewCard;
  }

  private getTableState(): TableTypes {
    const type = localStorage.getItem(this.tobaccoTableKey);
    if (!type) {
      localStorage.setItem(this.tobaccoTableKey, TableTypes.Card);
      return TableTypes.Card
    }
    return type as TableTypes;
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getTobaccos();
      }
    });
  }

  public clearBrands(): void {
    // TODO: switch mat-options class from selected to ... after reset
    // https://stackoverflow.com/questions/64994842/how-to-highlight-option-value-in-angular-mat-autocomplete-after-setvalue
    this.brandAutocompleteControl.patchValue(null);
  }

  private initFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: null,
      tagId: this.tagControl,
      brandId: this.brandControl,
      countryId: this.countyControl,
      lineId: this.lineControl,
      heavinessId: null
    });
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
