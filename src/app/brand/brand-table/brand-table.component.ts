import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../brand.service";
import {Observable, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {BrandCreateComponent} from "../brand-create/brand-create.component";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country'];
  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10, 25, 100];
  public sortBy = 'asc';
  public sorColumn = 'name';
  public filterBy?: string;

  public dataSource!: MatTableDataSource<Brand>;

  constructor(
    public dialog: MatDialog,
    private readonly brandService: BrandService,
  ) {}

  ngOnInit(): void {
    this.getBrands().subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.sort.sortChange.subscribe(sort => {
        this.sortBy = sort.direction;
        this.sorColumn = sort.active;
        this.getBrands().subscribe();
      })
    });
  }

  private getBrands(): Observable<GetAllResponse<Brand>> {
    return this.brandService.getAll(this.currentPage, this.pageSize, this.sortBy, this.sorColumn, this.filterBy).pipe(
      tap(response => {
        this.dataSource = new MatTableDataSource<Brand>(response.list);
        this.dataSource.data = response.list;
        this.totalRows = response.total;
        this.paginator.pageIndex = this.currentPage;
      })
    )
  }

  public paginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex ;
    this.getBrands().subscribe();
  }
  public applyFilter(event: Event): void {
    this.filterBy = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getBrands().subscribe();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public openDialog(): void {
    const enterAnimationDuration = '600ms';
    const exitAnimationDuration = '400ms';

    const dialogRef = this.dialog.open(BrandCreateComponent, {
      data: {},
      height: '450px',
      width: '900px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBrands().subscribe();
    });
  }



}
