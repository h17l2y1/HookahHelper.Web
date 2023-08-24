import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Filter} from "../../interfaces/models/filter";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Line} from "../../interfaces/entity/line";
import {Observable, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {CountryService} from "../../services/country.service";
import {LineService} from "../../services/line.service";
import {HeavinessService} from "../../services/heaviness.service";
import {ActivatedRoute} from "@angular/router";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {TagService} from "../../services/tag.service";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public checked = true;
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [25, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public filters!: Filter;
  public tobaccos!: Tobacco[];
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];
  public allCountriesOption!: Country[];
  public filteredCountriesOptions!: Country[];
  public linesOption: Line[] = [];
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public brandId!: string | null;
  public filterForm!: FormGroup;
  public brandControl: FormControl = this.formBuilder.control('');
  public brandAutocompleteControl: FormControl = this.formBuilder.control('');
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public countyControl: FormControl = this.formBuilder.control('');
  public lineControl: FormControl = this.formBuilder.control({value: '', disabled: true});
  public isLoadingResults = true;

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    private brandService: BrandService,
    private countryService: CountryService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterForm();

    this.route.params.subscribe(() => {
      this.brandId = this.route.snapshot.paramMap.get('id');
      this.filters = {
        name: null,
        brandId: this.brandId,
        countryId: null,
        lineId: null,
        heavinessId: null
      };

      this.brandControl.setValue(this.brandId, {emitEvent: false});
    });

    this.filterForm.valueChanges.pipe(
      tap((filters: Filter) => {
        this.filters = filters;
        this.getTobaccos();
      })
    ).subscribe();

    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
        this.filteredBrandsOptions = brands;
      })
    ).subscribe();

    this.brandAutocompleteControl.valueChanges.pipe(
      tap((value: string | Brand) => {
        if (typeof value === 'string'){
          this.filteredBrandsOptions = this._filter(this.allBrandsOption, value);
          return;
        }
        this.brandControl.setValue(value?.id)
        this.filteredBrandsOptions =  value?.name ? this._filter(this.allBrandsOption, value.name) : this.allBrandsOption.slice();
      }),
    ).subscribe();

    this.countryService.getOptions().pipe(
      tap(countries => {
        this.allCountriesOption = countries;
        this.filteredCountriesOptions = countries;
      })
    ).subscribe();

    this.countryAutocompleteControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string'){
          this.filteredCountriesOptions = this._filter(this.allCountriesOption, value);
          return;
        }
        this.countyControl.setValue(value?.id)
        this.filteredCountriesOptions = value?.name ? this._filter(this.allCountriesOption, value.name) : this.allBrandsOption.slice();
      }),
    ).subscribe();

  }

  ngAfterViewInit(): void {
    this.getTobaccos();
  }

  public displayFn(brand: { name: string }): string {
    return brand && brand.name ? brand.name : '';
  }

  public getTobaccos(): void {
    this.isLoadingResults = true;
    this.tobaccoService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filters)
      .subscribe((data: GetAllResponse<Tobacco>) => {
        this.isLoadingResults = false;
        this.tobaccos = data.list;
        this.totalRows = data.total
      });
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      maxWidth: '1000px',
      height: '70%',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onCreate();
      }
      this.getTobaccos();
    });
  }

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: null,
      tags: {value: null, disabled: true},
      brandId: this.brandControl,
      countryId: this.countyControl,
      lineId: this.lineControl,
      heavinessId: null,
    })
  }

  private _filter(array: {name: string}[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
