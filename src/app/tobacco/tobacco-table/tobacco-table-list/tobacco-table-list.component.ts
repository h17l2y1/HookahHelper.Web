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
import {Filter} from "../../../interfaces/models/filter";
import {UserDataService} from "../../../services/user-data.service";
import {Tag} from "../../../interfaces/entity/tag";
import {UserPermission} from "../../../shared/user-permission";
import {TagType} from "../../../interfaces/enums/tag-type";
import {Router} from "@angular/router";

export interface TobaccoList extends Tobacco {
  tagsDefault: Tag[];
  tagsGlobal: Tag[];
}

@Component({
  selector: 'app-tobacco-table-list',
  templateUrl: './tobacco-table-list.component.html',
  styleUrls: ['./tobacco-table-list.component.scss']
})
export class TobaccoTableListComponent extends UserPermission implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() filter$!: Observable<Filter>;
  @Input() filter!: Filter;

  public userData$ = this.userDataService.getUser;
  public allColumns: string[] = ['image', 'name', 'description', 'tags', 'globalTags', 'rating', 'action'];
  public displayedColumns!: string[];
  public tobaccos!: Tobacco[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [23, 40, 60, 100];
  public pageSize = this.pageSizeOptions[0];
  public tobaccosList!: TobaccoList[];
  public isLoadingResults!: boolean;
  public readonly TagType = TagType;

  constructor(
    userDataService: UserDataService,
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    private router: Router,
    ) {
    super(userDataService);
  }

  ngOnInit(): void {
    this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);

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
    this.router.navigateByUrl(`/tobaccos/${id}`).then(() => {});
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
