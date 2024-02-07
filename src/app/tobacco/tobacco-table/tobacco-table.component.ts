import {Component, OnInit} from '@angular/core';
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
import {RoleService} from "../../services/role.service";
import {UserData} from "../../interfaces/models/user-data";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit {
  public brandId: string | null = this.route.snapshot.data['brandId'];
  public userData$: Observable<UserData> = this.roleService.getUserData;
  public checked: boolean = false;
  public filters$!: Observable<Filter>;
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
  public filterForm: FormGroup = this.initFilterForm();
  public filters = this.filterForm.value;

  constructor(
    public roleService: RoleService,
    public dialog: MatDialog,
    private brandService: BrandService,
    private countryService: CountryService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
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
        this.filteredBrandsOptions = value?.name ? this._filter(this.allBrandsOption, value.name) : this.allBrandsOption.slice();
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
        this.filteredCountriesOptions = value?.name ? this._filter(this.allCountriesOption, value.name) : this.allCountriesOption.slice();
      }),
    ).subscribe();

    this.filters$ = this.filterForm.valueChanges;
  }

  public displayFn(brand: { name: string }): string {
    return brand && brand.name ? brand.name : '';
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
    return this.filterForm = this.formBuilder.group({
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
