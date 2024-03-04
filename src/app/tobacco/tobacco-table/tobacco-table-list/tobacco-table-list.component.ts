import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {tap} from "rxjs";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {QueryParams} from "../../../interfaces/models/queryParams";
import {UserDataSharedService} from "../../../services/shared/user-data-shared.service";
import {Tag} from "../../../interfaces/entity/tag";
import {UserPermission} from "../../../shared/user-permission";
import {TagType} from "../../../interfaces/enums/tag-type";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

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
  public filter?: QueryParams | null;
  public allColumns: string[] = ['image', 'name', 'description', 'tags', 'globalTags', 'rating', 'action'];
  public displayedColumns!: string[];
  // public tobaccos!: Tobacco[];
  public tobaccos!: MatTableDataSource<Tobacco>;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public pageSizeOptions: number[] = [23, 40, 60, 100];
  public pageSize: number = this.pageSizeOptions[0];
  public tobaccosList!: TobaccoList[];
  public isLoadingResults!: boolean;
  public readonly TagType = TagType;
  public animation: string = 'progress-dark';
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
    private tobaccoService: TobaccoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(userDataService);
  }

  ngOnInit(): void {
    this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.filter = {
        name: params.get('name'),
        tagId: params.get('tagId'),
        brandId: params.get('brandId'),
        countryId: params.get('countryId'),
        lineId: params.get('lineId'),
        heavinessId: params.get('heavinessId'),
      }
      this.getTobaccos();
    });
  }

  ngAfterViewInit(): void {
    this.tobaccos.sort = this.sort;
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
          // this.tobaccos = response.list;
          this.tobaccos = new MatTableDataSource(response.list);
          this.totalRows = response.total
          this.tobaccosList = response.list?.map(tobacco => {
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
    this.router.navigateByUrl(`/tobacco/${id}`).then(() => {});
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
