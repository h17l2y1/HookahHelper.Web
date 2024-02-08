import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Filter} from "../interfaces/models/filter";
import {MatTableDataSource} from "@angular/material/table";
import {Mix} from "../interfaces/entity/mix";
import {TopMixService} from "./top-mix.service";
import {map, merge, startWith, switchMap, tap} from "rxjs";
import {RoleService} from "../services/role.service";
import {Router} from "@angular/router";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../constants";
import {MatDialog} from "@angular/material/dialog";
import {MixViewComponent} from "./mix-view/mix-view.component";

@Component({
  selector: 'app-top-mix',
  templateUrl: './top-mix.component.html',
  styleUrls: ['./top-mix.component.scss']
})
export class TopMixComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public userData$ = this.roleService.getUserData;
  public isAdmin: boolean = false;
  public readonly allColumns: string[] = ['name', 'rating', 'action'];
  public displayedColumns!: string[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [10, 25, 100];
  public pageSize = this.pageSizeOptions[0];
  public filters: Filter = {
    name: null,
  };
  public isLoadingResults = true;
  public dataSource!: MatTableDataSource<Mix>;

  constructor(
    private mixService: TopMixService,
    public roleService: RoleService,
    public dialog: MatDialog,
    private router: Router) {
    this.userData$.subscribe(userData => {
      this.isAdmin = userData.isAdmin;
      this.displayedColumns = userData.isAdmin ? this.allColumns : this.allColumns.slice(0, -1)
    })
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getMixes();
  }

  private getMixes(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.mixService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filters)
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalRows = data.total;
          return data.list;
        }),
      ).subscribe((data: Mix[]) => {
      this.dataSource = new MatTableDataSource<Mix>(data);
    });
  }

  public applyFilter(event: Event): void {
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getMixes();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getMixes();
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

        dialogRef.afterClosed().subscribe(result => {
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
}
