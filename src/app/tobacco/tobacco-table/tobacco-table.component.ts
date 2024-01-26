import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Filter} from "../../interfaces/models/filter";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, switchMap, tap} from "rxjs";
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
import {Tag} from "../../interfaces/entity/tag";
import {TagService} from "../../tag/tag.service";
import {TobaccoList} from "./tobacco-table-list/TobaccoList";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // public checked = false;
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [23, 40, 60, 100];
  public pageSize = this.pageSizeOptions[0];
  public filters!: Filter;
  public tobaccos!: Tobacco[];
  public tobaccosList!: TobaccoList[];
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];
  public allCountriesOption!: Country[];
  public filteredCountriesOptions!: Country[];
  public linesOption: Line[] = [];
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public tagsGlobal$: Observable<Tag[]> = this.tagService.getGlobalOptions();
  public brandId!: string | null;
  public filterForm!: FormGroup;
  public brandControl: FormControl = this.formBuilder.control('');
  public brandAutocompleteControl: FormControl = this.formBuilder.control('');
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public countyControl: FormControl = this.formBuilder.control('');
  public lineControl: FormControl = this.formBuilder.control({value: '', disabled: true});
  public tagControl: FormControl = this.formBuilder.control('');
  public isLoadingResults = true;
  public isAdmin$ = this.roleService.isAdmin;

  constructor(
    public roleService: RoleService,
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
        tagId: null,
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
        this.paginator.firstPage();
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

    this.brandControl.valueChanges.pipe(
      tap(value => {
        if (!value){
          this.lineControl.setValue(null,{ emitEvent: false });
          this.lineControl.disable({ emitEvent: false });
        }
      }),
      filter(Boolean),
      switchMap(value => this.lineService.getLinesByBrandId(value)),
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable({ emitEvent: false });
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
        if (typeof value === 'string'){
          this.filteredCountriesOptions = this._filter(this.allCountriesOption, value);
          return;
        }
        this.countyControl.setValue(value?.id)
        this.filteredCountriesOptions = value?.name ? this._filter(this.allCountriesOption, value.name) : this.allCountriesOption.slice();
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
      .pipe(
        tap((response: GetAllResponse<Tobacco>) => {
          this.tobaccos = response.list;
          this.totalRows = response.total
          this.tobaccosList = this.tobaccos?.map(tobacco => {
            const tobaccoList = tobacco as TobaccoList;
            tobaccoList.tagsDefault = tobacco.tags.filter(tag => !tag.isGlobal);
            tobaccoList.tagsGlobal = tobacco.tags.filter(tag => tag.isGlobal);
            return tobaccoList;
          })
        })
      )
      .subscribe(() => {
        this.isLoadingResults = false;
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
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.getTobaccos();
      }
    });
  }

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: null,
      tagId: this.tagControl,
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
