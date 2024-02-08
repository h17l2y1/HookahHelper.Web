import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {Observable, tap} from "rxjs";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {TobaccoViewComponent} from "../../tobacco-view/tobacco-view.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {Filter} from "../../../interfaces/models/filter";

@Component({
  selector: 'app-tobacco-table-card',
  templateUrl: './tobacco-table-card.component.html',
  styleUrls: ['./tobacco-table-card.component.scss']
})
export class TobaccoTableCardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() filter$!: Observable<Filter>;
  @Input() filter!: Filter;

  public tobaccos!: Tobacco[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [23, 40, 60, 100];
  public pageSize = this.pageSizeOptions[0];
  public isLoadingResults!: boolean;

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService
  ) {
  }

  ngOnInit(): void {
    this.filter$.pipe(
      tap(filter => {
        this.filter = filter;
        this.getTobaccos();
      })
    ).subscribe()

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

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public getTobaccos(): void {
    const pag = this.paginator ? this.paginator.pageIndex : 0;
    this.isLoadingResults = true;
    this.tobaccoService.getAll(pag, this.pageSize, 'asc', 'name', this.filter)
      .pipe(
        tap((response: GetAllResponse<Tobacco>) => {
          this.tobaccos = response.list;
          this.totalRows = response.total;
          // this.tobaccosList = this.tobaccos?.map(tobacco => {
          //   const tobaccoList = tobacco as TobaccoList;
          //   tobaccoList.tagsDefault = tobacco.tags.filter(tag => !tag.isGlobal);
          //   tobaccoList.tagsGlobal = tobacco.tags.filter(tag => tag.isGlobal);
          //   return tobaccoList;
          // })
        })
      )
      .subscribe(() => this.isLoadingResults = false);
  }
}
