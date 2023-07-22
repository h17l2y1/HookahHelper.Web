import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {TobaccoService} from "../tobacco.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {GetAllResponse} from "../../interfaces/models/get-all-response";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements AfterViewInit  {
  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 2;
  public pageSizeOptions = [2, 5, 10, 25, 100];
  public filterBy?: string;
  public isLoadingResults = true;

  public tobaccos!: Tobacco[];

  constructor(
    public dialog: MatDialog,
    private readonly tobaccoService: TobaccoService
  ) {}

  ngAfterViewInit(): void {
    this.getTobaccos();
  }

  public openDialog(): void {
    const enterAnimationDuration = '600ms';
    const exitAnimationDuration = '400ms';

    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      data: {},
      height: '400px',
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      const xxx = result;
    });
  }

  public getTobaccos(): void {
    this.tobaccoService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filterBy)
      .subscribe((data: GetAllResponse<Tobacco>) => {
        this.tobaccos = data.list;
        this.totalRows =data.total
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }
}
