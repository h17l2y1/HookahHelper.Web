import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Filter} from "../../interfaces/models/filter";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, switchMap, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand/brand.service";
import {CountryService} from "../../services/country.service";
import {LineService} from "../../services/line.service";
import {HeavinessService} from "../../services/heaviness.service";
import {ActivatedRoute} from "@angular/router";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {Tag} from "../../interfaces/entity/tag";
import {TagService} from "../../tag/tag.service";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {FilterSharedService} from "../filter-shared.service";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent extends UserPermission implements OnInit {
  public readonly tobaccoTableKey: string = 'tobacco_table_state';
  public readonly TableTypes = TableTypes;
  public brandId: string | null = this.route.snapshot.data['brandId'];
  public isTableViewCard: boolean = this.getTableState() === TableTypes.Card;
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];
  public allCountriesOption!: Country[];
  public filteredCountriesOptions!: Country[];
  public linesOption: Line[] = [];
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public tagsGlobal$: Observable<Tag[]> = this.tagService.getGlobalOptions();
  public brandControl: FormControl = this.formBuilder.control(this.brandId);
  public brandAutocompleteControl: FormControl = this.formBuilder.control('');
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public countyControl: FormControl = this.formBuilder.control('');
  public lineControl: FormControl = this.formBuilder.control({value: '', disabled: true});
  public tagControl: FormControl = this.formBuilder.control('');
  public isMobileMode!: boolean;
  public filterForm: FormGroup = this.initFilterForm();
  // public filterForm!: FormGroup;

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private brandService: BrandService,
    private countryService: CountryService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private filterSharedService: FilterSharedService,
    private cdr: ChangeDetectorRef,
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
    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
        this.filteredBrandsOptions = brands;
        if (this.brandId) {
          const brand = this.allBrandsOption.find(x => x.id === this.brandId);
          this.brandAutocompleteControl.setValue(brand, {emitEvent: false});
        }
      })
    ).subscribe();

    this.brandAutocompleteControl.valueChanges.pipe(
      tap((value: string | Brand) => {
        if (typeof value === 'string') {
          this.filteredBrandsOptions = this._filter(this.allBrandsOption, value);
          return;
        }
        this.brandControl.setValue(value?.id)
        this.filteredBrandsOptions = value?.name ? this._filter(this.allBrandsOption, value.name)
          : this.allBrandsOption.slice();
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

    this.countryService.getOptions().pipe(
      tap(countries => {
        this.allCountriesOption = countries;
        this.filteredCountriesOptions = countries;
      })
    ).subscribe();

    this.countryAutocompleteControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.filteredCountriesOptions = this._filter(this.allCountriesOption, value);
          return;
        }
        this.countyControl.setValue(value?.id)
        this.filteredCountriesOptions = value?.name ? this._filter(this.allCountriesOption, value.name)
          : this.allCountriesOption.slice();
      }),
    ).subscribe();

    this.filterForm.valueChanges.pipe(
      tap((value: Filter) => {
        value.brandId = this.brandId;
        console.log('filterForm.valueChanges', value);
        this.filterSharedService.setFilters(value);
      })
    ).subscribe();

    this.filterSharedService.getFilters.pipe(
      tap(value => {
        // console.log(value)
        // this.initFilterForm1(value)
        if (value){
          // this.filterForm.patchValue(value, {emitEvent: false});
          console.log('SharedService.getFilters', value)
          // this.filterForm.patchValue({brandId: value?.brandId}, {emitEvent: false});
          // console.log('GetFilters - filter', value)
          // console.log('FilterForm before setValue', this.filterForm.value)
          // this.brandControl.patchValue(value?.brandId, {emitEvent: false});
          // this.brandControl.patchValue(value?.brandId);
          // console.log('FilterForm after setValue', this.filterForm.value)
          // this.cdr.detectChanges();
        }
        // console.log('GetFilters', this.filterForm.value)
        // this.filterForm.patchValue({brandId: value?.brandId}, {emitEvent: false})
        // console.log(this.filterForm.value);
        // this.cdr.detectChanges();
        // this.filterForm.patchValue({brandId: value?.brandId});
      })
    ).subscribe();

    // console.log('Form after init', this.filterForm.value)
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
