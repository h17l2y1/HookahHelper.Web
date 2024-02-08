import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {RoleService} from "../../../services/role.service";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand.service";
import {Router} from "@angular/router";
import {BrandEditorComponent} from "../../brand-editor/brand-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {map, merge, Observable, startWith, switchMap, tap} from "rxjs";
import {Brand} from "../../../interfaces/entity/brand";
import {Filter} from "../../../interfaces/models/filter";
import {MatSort} from "@angular/material/sort";
import {UserData} from "../../../interfaces/models/user-data";

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})

export class BrandListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() filter$!: Observable<Filter>;
  public userData$: Observable<UserData> = this.roleService.getUserData;
  public allColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
  public displayedColumns!: string[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [10, 25, 100];
  public pageSize = this.pageSizeOptions[0];
  public isLoadingResults: boolean = false;
  public filter!: Filter;
  public brands: Brand[] = [];

  constructor(
    public roleService: RoleService,
    public dialog: MatDialog,
    private brandService: BrandService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userData$.subscribe(userData => {
      this.displayedColumns = userData.isAdmin ? this.allColumns : this.allColumns.slice(0, -1)
    })
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filter$
      .pipe(
        tap(filter => {
          this.filter = filter;
        }),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filter);
        })
      )
      .subscribe(data => {
        this.isLoadingResults = false;
        this.brands = data.list;
        this.totalRows = data.total;
      });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.cdr.detectChanges();
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filter)
        }),
        map(response => {
          this.isLoadingResults = false;
          this.totalRows = response.total;
          return response.list;
        }),
      )
      .subscribe(brands => {
        this.brands = brands;
      });
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filter);
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
        this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filter);
      }
    });
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.brandService.remove(id).subscribe(() =>
          this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filter))
      }
    });
  }

  public onBrand(id: string): void {
    this.router.navigateByUrl(`/tobacco/${id}`).then(() => {});
  }

}
