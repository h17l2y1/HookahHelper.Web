import {AfterViewInit, Component, input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {QueryParams} from "../interfaces/models/queryParams";
import {MatTableDataSource} from "@angular/material/table";
import {Mix} from "../interfaces/entity/mix";
import {TopMixService} from "./top-mix.service";
import {debounceTime, distinctUntilChanged, map, merge, Observable, startWith, switchMap, tap} from "rxjs";
import {UserDataSharedService} from "../services/shared/user-data-shared.service";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {MatDialog} from "@angular/material/dialog";
import {MixViewComponent} from "./mix-view/mix-view.component";
import {UserPermission} from "../shared/user-permission";
import {FormBuilder, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GetAllResponse} from "../interfaces/models/get-all-response";
import {Brand} from "../interfaces/entity/brand";

@Component({
  selector: 'app-top-mix',
  templateUrl: './top-mix.component.html',
  styleUrls: ['./top-mix.component.scss']
})
export class TopMixComponent extends UserPermission implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public isAdmin: boolean = false;
  public readonly allColumns: string[] = ['name', 'rating', 'action'];
  public displayedColumns!: string[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [5, 60, 120];
  public pageSize = this.pageSizeOptions[0];
  public queryParams: QueryParams = this.route.snapshot.data['queryParam'];
  public nameControl: FormControl = this.formBuilder.control(this.queryParams.name);

  public isLoadingResults = true;
  public dataSource!: MatTableDataSource<Mix>;

  constructor(
    userDataService: UserDataSharedService,
    private mixService: TopMixService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {
    super(userDataService);
  }

  ngOnInit(): void {
    this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1)
    this.queryParams.take = this.queryParams.take ? this.queryParams.take : this.pageSize;
    this.getMixes().subscribe();
    this.currentPage = this.queryParams.page ? this.queryParams.page : 0;
    this.nameControl.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      tap(value => {
        this.queryParams.name = value;
        this.redirect();
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getMixes();
  }

  private getMixes(): Observable<GetAllResponse<Mix>> {
    this.isLoadingResults = true;
    return this.mixService.getAll(this.queryParams)
      .pipe(
        tap(response => {
          this.isLoadingResults = false;
          this.totalRows = response.total;
          this.dataSource = new MatTableDataSource<Mix>(response.list)
        })
      )
  }

  // public applyFilter(event: Event): void {
  //   this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.getMixes();
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.queryParams.page = e.pageIndex
    this.queryParams.take = e.pageSize

    this.redirect();
  }

  public onView(id: string): void {
    this.mixService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(MixViewComponent, {
          data: {
            mix: response
          },
          // width: '300',
          // height: '300',
          // maxWidth: '1200px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(() => {
          // if (result){
          //   this.mixService.emit();
          // }
        });
      }))
      .subscribe();
  }

  public notAdminView(id: string): void {
    if (!this.isAdmin)
      this.onView(id);
  }

  private redirect(): void {
    this.router.navigate(['/mixes/'], {
      queryParams: {
        page: this.queryParams.page,
        take: this.queryParams.take,
        sortBy: this.queryParams.sortBy,
        type: this.queryParams.type,
        name: this.nameControl.value,
      }
    }).then(() => this.getMixes().subscribe());
  }

  protected readonly input = input;
}
