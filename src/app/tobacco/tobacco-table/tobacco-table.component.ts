import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {TobaccoService} from "../tobacco.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {ActivatedRoute} from "@angular/router";
import {BrandService} from "../../brand/brand.service";
import {CountryService} from "../../services/country.service";
import {forkJoin, tap} from "rxjs";
import {Filter} from "../../interfaces/models/filter";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit, AfterViewInit {
  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public filterBy?: string;
  public filters!: Filter;
  public tobaccos!: Tobacco[];
  private sub: any;

  public brands$ = this.brandService.getOptions();
  public countries$ = this.countryService.getOptions();
  private brandId!: string | null;

  constructor(
    public dialog: MatDialog,
    private readonly tobaccoService: TobaccoService,
    private readonly brandService: BrandService,
    private readonly countryService: CountryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // const brands$ = this.brandService.getOptions();
    // const countries$ = this.countryService.getOptions();
    //
    // forkJoin([
    //   brands$.pipe(tap(brands => {})),
    //   countries$.pipe(tap(countries => {})),
    // ]).subscribe();

    this.sub = this.route.params.subscribe(params => {
      this.brandId = this.route.snapshot.paramMap.get('id');
      // if (id){
      //   this.filterBy =
      //   this.getTobaccos();
      //   return;
      // }
      // this.getTobaccos();
      this.filters = {
        name: null,
        brandId: this.brandId,
        countyId: null,
      };
    });
  }

  ngAfterViewInit(): void {
    this.getTobaccos();
  }

  public getTobaccos(): void {
    this.tobaccoService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filters)
      .subscribe((data: GetAllResponse<Tobacco>) => {
        this.tobaccos = data.list;
        this.totalRows = data.total
      });
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

  public handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public applyFilter(event: Event): void {
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();

    let firstPage = 0;
    this.paginator.pageIndex = firstPage;
    this.paginator.page.next({
      pageIndex: firstPage,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
    this.getTobaccos();
  }
}
