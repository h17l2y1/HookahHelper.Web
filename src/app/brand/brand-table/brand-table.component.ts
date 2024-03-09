import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {debounceTime, distinctUntilChanged, Observable, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {ActivatedRoute, Router} from "@angular/router";
import {QueryParams} from "../../interfaces/models/queryParams";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Brand} from "../../interfaces/entity/brand";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {BrandService} from "../brand.service";
import {BrandEditorComponent} from "../brand-editor/brand-editor.component";
import {ConfirmationPopupComponent} from "../../shared/components/confirmation-popup/confirmation-popup.component";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent extends UserPermission implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public animation: string = 'progress-dark';
  public allColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
  public displayedColumns: string[] = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);
  public readonly brandTableKey: string = 'brand_table_state';
  public countries: Country[] = this.route.snapshot.data['countries'];
  public queryParams: QueryParams = this.route.snapshot.data['queryParam'];
  public countriesOptionsFiltered: Country[] = this.countries.slice();
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
  public skeletonCount = new Array<number>(20).fill(0);
  public skeletonLineStyle = {
    'background-color': '#262626',
    'animation-duration': '2s',
    'margin': '0'
  }
  public skeletonImageStyle = {
    'background-color': '#262626',
    'animation-duration': '2s',
    'margin': '0',
    'height': '100px',
    'width': '230px'
  }
  public skeletonStyle = {
    'border-radius': '5px',
    'height': '50px',
    'background-color': '#262626',
    'border': '1px solid #323232',
    'animation-duration': '2s',
    'margin': '0'
  }

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
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
        if (typeof value === 'string') {
          this.countriesOptionsFiltered = this._filter(this.countries, value);
          return;
        }
        this.queryParams.countryId = value?.id;
        this.redirect();
      })
    ).subscribe();

    this.getBrands().subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.isCardView) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      this.sort.sortChange.pipe(
        tap(value => {
          this.queryParams.sortBy = value.direction;
          this.queryParams.type = value.active;
          this.redirect();
        })
      ).subscribe();
    }

    this.paginator.page.pipe(
      tap(value => {
        this.queryParams.page = value.pageIndex;
        this.queryParams.take = value.pageSize;
        this.redirect();
      })
    ).subscribe();
  }

  private redirect(): void {
    this.router.navigate(['/brands/'], {
      queryParams: {...this.queryParams}
    }).then(() => this.getBrands().subscribe());
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
    this.isCardView = type === TableTypes.Card
    return this.isCardView;
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

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.queryParams.page = e.pageIndex
    this.queryParams.take = e.pageSize

    this.redirect();
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
    const dialogRef = this.dialog.open(BrandEditorComponent, {
      data: {id: id},
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.redirect();
      }
    });
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      // width: "300px",
      backdropClass: 'blurred',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.brandService.remove(id).subscribe(() => this.redirect())
      }
    });
  }

  public onBrandList(id: string): void {
    this.router.navigate(['/tobaccos/'], {queryParams: {brandId: id}});
  }
}
