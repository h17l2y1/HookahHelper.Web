import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, tap} from "rxjs";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {TobaccoList} from "./TobaccoList";
import {Filter} from "../../../interfaces/models/filter";
import {RoleService} from "../../../services/role.service";
import {TobaccoViewComponent} from "../../tobacco-view/tobacco-view.component";

@Component({
  selector: 'app-tobacco-table-list',
  templateUrl: './tobacco-table-list.component.html',
  styleUrls: ['./tobacco-table-list.component.scss']
})
export class TobaccoTableListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() filter$!: Observable<Filter>;
  @Input() filter!: Filter;

  public userData$ = this.roleService.getUserData;
  public allColumns: string[] = ['image', 'name', 'description', 'tags', 'globalTags', 'rating', 'action'];
  public displayedColumns!: string[];
  public tobaccos!: Tobacco[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [23, 40, 60, 100];
  public pageSize = this.pageSizeOptions[0];
  public tobaccosList!: TobaccoList[];
  public isLoadingResults!: boolean;

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    public roleService: RoleService) {
  }

  ngOnInit(): void {
    this.userData$.subscribe(userData => {
      this.displayedColumns = userData.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);
    });

    this.filter$.pipe(
      tap(filter => {
        this.filter = filter;
        this.getTobaccos();
      })
    ).subscribe();

    this.getTobaccos();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.getTobaccos();
    });
  }

  public getTobaccos(): void {
    const paginator = this.paginator ? this.paginator.pageIndex : 0;
    const sortDirection = this.sort ? this.sort.direction : 'asc';
    const sortActive = this.sort ? this.sort.active : 'name';
    this.isLoadingResults = true;
    this.tobaccoService.getAll(paginator, this.pageSize, sortDirection, sortActive, this.filter)
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
      .subscribe(() => this.isLoadingResults = false);
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public onView(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoViewComponent, {
          data: {
            tobacco: response
          },
          // width: '300',
          // height: '300',
          // maxWidth: '1200px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getTobaccos();
          }
        });
      }))
      .subscribe();
  }

  public onEdit(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoEditorComponent, {
          data: {
            tobacco: response
          },
          maxWidth: '1000px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getTobaccos();
          }
        });
      }))
      .subscribe();
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.tobaccoService.remove(id).pipe(
          tap(() => this.getTobaccos())
        ).subscribe();
      }
    });
  }

}
