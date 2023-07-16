import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {TobaccoService} from "../tobacco.service";
import {map, merge, startWith, switchMap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Tobacco} from "../../interfaces/entity/tobacco";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements AfterViewInit  {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country'];

  public dataSource!: MatTableDataSource<Tobacco>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10, 25, 100];
  public filterBy?: string;
  public isLoadingResults = true;

  constructor(
    public dialog: MatDialog,
    private readonly tobaccoService: TobaccoService
  ) {}

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
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

  private getTobaccos(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tobaccoService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filterBy)
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalRows = data.total;
          return data.list;
        }),
      )
      .subscribe((data: Tobacco[]) => {
        this.dataSource = new MatTableDataSource<Tobacco>(data);
        // this.dataSource.data = data
      });
  }

}
