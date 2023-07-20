import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../brand.service";
import {forkJoin, map, merge, startWith, switchMap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {BrandEditorComponent} from "../brand-editor/brand-editor.component";
import {CountryService} from "../../services/country.service";
import {BrandCreateComponent} from "../brand-create/brand-create.component";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
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
    private readonly countryService: CountryService,
  ) {
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
      });
  }

  public applyFilter(event: Event): void {
    this.filterBy = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getBrands();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public create(): void {
    const enterAnimationDuration = '600ms';
    const exitAnimationDuration = '400ms';

    const dialogRef = this.dialog.open(BrandCreateComponent, {
      data: {},
      height: '450px',
      width: '900px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getBrands()
      }
    });
  }

  public update(id: string): void {
    const dialogRef = this.dialog.open(BrandEditorComponent, {
      data: {id: id},
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getBrands()
      }
    });
  }

  public delete(id: string): void {
    // TODO: add popup
    this.brandService.remove(id).subscribe(() => this.getBrands())
  }

}
