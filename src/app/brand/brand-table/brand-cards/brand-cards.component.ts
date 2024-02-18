import {AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {map, merge, Observable, startWith, switchMap, tap} from "rxjs";
import {Filter} from "../../../interfaces/models/filter";
import {Brand} from "../../../interfaces/entity/brand";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-brand-cards',
  templateUrl: './brand-cards.component.html',
  styleUrls: ['./brand-cards.component.scss']
})
export class BrandCardsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() filter$!: Observable<Filter>;
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [30, 60, 120];
  public pageSize = this.pageSizeOptions[0];
  public isLoadingResults: boolean = false;
  public filter!: Filter;
  public brands: Brand[] = [];

  constructor(
    public dialog: MatDialog,
    private brandService: BrandService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    this.filter$
      .pipe(
        tap(filter => {
          this.filter = filter;
        }),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filter);
        })
      )
      .subscribe(data => {
        this.isLoadingResults = false;
        this.brands = data.list;
        this.totalRows = data.total;
      });

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.cdr.detectChanges();
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filter)
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
    this.brandService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filter);
  }

  public onBrand(id: string): void {
    // this.router.navigateByUrl(`/tobaccos/${id}`).then(() => {});
  }

}
