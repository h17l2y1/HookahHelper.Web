import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../brand.service";
import {catchError, map, merge, Observable, of, startWith, switchMap, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent implements AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country'];
  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 5;
  public pageSizeOptions = [5, 10, 25, 100];
  public filterBy?: string;
  public isLoadingResults = true;

  public dataSource!: MatTableDataSource<Brand>;

  constructor(
    public dialog: MatDialog,
    private readonly brandService: BrandService,
    private toastr: ToastrService
  ) {}

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  getError(): void {
    this.brandService.error().subscribe();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getBrands();
  }

  private getBrands(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filterBy)
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalRows = data.total;
          return data.list;
        }),
      )
      .subscribe((data: Brand[]) => {
        this.dataSource = new MatTableDataSource<Brand>(data);
        // this.dataSource.data = data
      });
  }

  public applyFilter(event: Event): void {
    this.filterBy = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getBrands();

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
      this.getBrands();
      this.toastr.success('Hello world!', 'Toastr fun!');
    });
  }



}
