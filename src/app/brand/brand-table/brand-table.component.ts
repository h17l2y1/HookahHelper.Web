import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {debounceTime, distinctUntilChanged, Observable, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {ActivatedRoute, Router} from "@angular/router";
import {QueryParams} from "../../interfaces/models/queryParams";
import {Brand} from "../../interfaces/entity/brand";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {BrandService} from "../brand.service";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent extends UserPermission implements OnInit, AfterViewInit {
  public animation: string = 'progress-dark';
  public readonly brandTableKey: string = 'brand_table_state';
  public countries: Country[] = this.route.snapshot.data['countries'];
  public queryParams: QueryParams = this.route.snapshot.data['queryParam'];
  public nameControl: FormControl = this.formBuilder.control(this.queryParams.name);
  public countryControl: FormControl = this.formBuilder.control(this.countries.find(x => x.id === this.queryParams.countryId));
  public brandFilterForm: FormGroup = this.initBrandFilterForm();
  protected readonly TableTypes = TableTypes;
  public isCardView: boolean = true;
  public isMobileMode!: boolean;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public pageSizeOptions: number[] = [30, 60, 120];
  public pageSize: number = this.pageSizeOptions[0];
  public isLoadingResults: boolean = false;
  public brands: Brand[] = [];
  public sortField: string = this.queryParams.type ?? 'name';
  public sortDirection: string = this.queryParams.sortBy ?? 'asc';
  public skeletonCount = new Array<number>(20).fill(0);
  public skeletonLineStyle = {'background-color': '#262626', 'animation-duration': '2s', 'margin': '0'};
  public skeletonImageStyle = {'background-color': '#262626', 'animation-duration': '2s', 'margin': '0', 'height': '100px', 'width': '230px'};
  public skeletonStyle = {'border-radius': '5px', 'height': '50px', 'background-color': '#262626', 'border': '1px solid #323232', 'animation-duration': '2s', 'margin': '0'};

  constructor(
    userDataService: UserDataSharedService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private brandService: BrandService,
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
    this.isCardView = tableType === TableTypes.Card;
    this.queryParams.take = this.queryParams.take ? this.queryParams.take : this.pageSize;
    this.queryParams.type = this.queryParams.type ?? this.sortField;
    this.queryParams.sortBy = this.queryParams.sortBy ?? this.sortDirection;

    this.nameControl.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      tap(value => {
        this.queryParams.name = value;
        this.redirect();
      })
    ).subscribe();

    this.countryControl.valueChanges.pipe(
      tap(value => {
        this.queryParams.countryId = value?.id;
        this.redirect();
      })
    ).subscribe();

    this.getBrands().subscribe();
  }

  ngAfterViewInit(): void {
  }

  private redirect(): void {
    this.router.navigate(['/brands/'], {
      queryParams: {...this.queryParams}
    }).then(() => this.getBrands().subscribe());
  }

  public displayFn(country: { name: string }): string {
    return country && country.name ? country.name : '';
  }

  public switchTableView(type: TableTypes): boolean {
    localStorage.setItem(this.brandTableKey, type);
    this.isCardView = type === TableTypes.Card
    return this.isCardView;
  }

  public toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.queryParams.type = this.sortField;
    this.queryParams.sortBy = this.sortDirection;
    this.redirect();
  }

  public isSorted(field: string): boolean {
    return this.sortField === field;
  }

  public sortIcon(field: string): string {
    if (!this.isSorted(field)) {
      return '↕';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  public get totalPages(): number {
    return Math.max(0, Math.ceil(this.totalRows / this.pageSize));
  }

  public get pageNumbers(): number[] {
    return this.totalPages ? Array.from({length: this.totalPages}, (_, index) => index) : [];
  }

  public get rangeStart(): number {
    return this.totalRows ? (this.currentPage * this.pageSize) + 1 : 0;
  }

  public get rangeEnd(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRows);
  }

  public goToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || pageIndex === this.currentPage) {
      return;
    }

    this.currentPage = pageIndex;
    this.queryParams.page = pageIndex;
    this.redirect();
  }

  public previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  public nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  public handlePageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!value || value === this.pageSize) {
      return;
    }

    this.pageSize = value;
    this.currentPage = 0;
    this.queryParams.page = 0;
    this.queryParams.take = value;
    this.redirect();
  }

  private getTableState(): TableTypes {
    const type = localStorage.getItem(this.brandTableKey);
    if (!type) {
      localStorage.setItem(this.brandTableKey, TableTypes.Card);
      return TableTypes.Card
    }
    return type as TableTypes;
  }

  public onCreate(): void {
    this.router.navigate(['/brands/create']);
  }

  private initBrandFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: this.nameControl,
      countryId: this.countryControl
    });
  }

  private getBrands(): Observable<GetAllResponse<Brand>> {
    this.isLoadingResults = true;
    return this.brandService.getAll(this.queryParams)
      .pipe(
        tap(data => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          this.totalRows = data.total;
          this.brands = data.list
          return;
        }),
      )
  }

  public onUpdate(id: string): void {
    this.router.navigate(['/brands/edit', id]);
  }

  public onDelete(id: string): void {
    if (window.confirm('Delete this brand?')) {
      this.brandService.remove(id).subscribe(() => this.redirect());
    }
  }

  public onBrandList(id: string): void {
    this.router.navigate(['/tobaccos/'], {queryParams: {brandId: id}});
  }
}
