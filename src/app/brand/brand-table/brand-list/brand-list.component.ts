import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {UserDataSharedService} from "../../../services/shared/user-data-shared.service";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand.service";
import {BrandEditorComponent} from "../../brand-editor/brand-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {map, merge, Observable, of as observableOf, startWith, switchMap, tap} from "rxjs";
import {Brand} from "../../../interfaces/entity/brand";
import {Filter} from "../../../interfaces/models/filter";
import {MatSort, SortDirection} from "@angular/material/sort";
import {UserPermission} from "../../../shared/user-permission";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {MatTableDataSource} from "@angular/material/table";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})

export class BrandListComponent extends UserPermission implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public queryParams: Filter = this.route.snapshot.data['queryParam'];
  public allColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
  // public displayedColumns!: string[];
  public totalRows: number = 0;
  public currentPage: number = 0;
  public pageSizeOptions: number[] = [30, 60, 120];
  public pageSize: number = this.pageSizeOptions[0];
  public isLoadingResults: boolean = true;
  public brands: Brand[] = [];
  public animation: string = 'progress-dark';
  public skeletonStyle = {
    'border-radius': '5px',
    'height': '50px',
    'background-color': '#262626',
    'border': '1px solid #323232',
    'animation-duration': '2s',
    'margin': '0'
  }
  public dataSource!: MatTableDataSource<Brand>;


  displayedColumns: string[] = ['created', 'state', 'number', 'title'];
  data: Cat[] = [];
  resultsLength = 0;
  service!: ExampleHttpDatabase | null;


  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private _httpClient: HttpClient,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute) {
    super(userDataService);
  }

  private getBrands(): void {
    // const pag = this.paginator ? this.paginator.pageIndex : 0;
    // this.isLoadingResults = true;
    // this.brandService.getAll(pag, this.pageSize, 'asc', 'name', this.queryParams)
    //   .pipe(
    //     tap((response: GetAllResponse<Brand>) => {
    //       this.brands = response.list;
    //       this.totalRows = response.total;
    //       this.dataSource = new MatTableDataSource(response.list);
    //       // this.dataSource.paginator.t
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     }),
    //   )
    //   .subscribe(() => this.isLoadingResults = false);
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getBrands();
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
        this.getBrands();
      }
    });
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.brandService.remove(id).subscribe(() => this.getBrands())
      }
    });
  }

  public onBrandList(id: string): void {
    this.router.navigate(['/tobaccos/'], {queryParams: {brandId: id}});
  }

  ngOnInit(): void {
    // this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.queryParams = {
        name: params.get('name'),
        tagId: params.get('tagId'),
        brandId: params.get('brandId'),
        countryId: params.get('countryId'),
        lineId: params.get('lineId'),
        heavinessId: params.get('heavinessId'),
      }
      // this.getBrands();
    });
  }

  ngAfterViewInit() {
    this.service = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }
          this.resultsLength = data.length;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

export interface Cat {
  status: Status
  _id: string
  user: string
  text: string
  __v: number
  source: string
  updatedAt: string
  type: string
  createdAt: string
  deleted: boolean
  used: boolean
}

export interface Status {
  verified: boolean
  sentCount: number
  feedback?: string
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(sort: string, order: SortDirection, page: number): Observable<Cat[]> {
    const href = 'https://cat-fact.herokuapp.com';
    const requestUrl = `${href}/facts`;

    return this._httpClient.get<Cat[]>(requestUrl);
  }

}
