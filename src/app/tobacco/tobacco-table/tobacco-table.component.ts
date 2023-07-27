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
import {filter, forkJoin, Observable, switchMap, tap} from "rxjs";
import {Filter} from "../../interfaces/models/filter";
import {Brand} from "../../interfaces/entity/brand";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Line} from "../../interfaces/entity/line";
import {LineService} from "../../services/line.service";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public totalRows = 0;
  public currentPage = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];

  public filters!: Filter;

  public tobaccos!: Tobacco[];
  private brandsOption?: Brand[];
  public linesOption: Line[]=[];
  public brands$: Observable<Brand[]> = this.brandService.getOptions().pipe(
    tap(response => {
      this.brandsOption = response;
    })
  );
  public countries$: Observable<Country[]> = this.countryService.getOptions();

  public brandId!: string | null;
  // public leines$: Observable<Line[]> = this.lineService.getLinesByBrandId(this.brandId);
  public filterForm!: FormGroup;

  public brandControl = this.formBuilder.control('');
  public countyControl = this.formBuilder.control('');
  public lineControl = this.formBuilder.control('');

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    private brandService: BrandService,
    private countryService: CountryService,
    private lineService: LineService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFilterForm();

    this.filterForm.valueChanges.pipe(
      tap((filters: Filter) => {
        this.filters = filters;
        this.getTobaccos();
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      tap(brandId => {
        this.linesOption = [];
        this.brandId = brandId;
      }),
      filter(Boolean),
      switchMap(
        (brandId) => this.lineService.getLinesByBrandId(brandId as string)
      ),
      tap(lines => {
        this.linesOption = lines;
      }),
    ).subscribe();
// const zzz = this.filterForm.get('countryId');
    this.countyControl.valueChanges.pipe(
      tap(data => {
        this.brandControl.setValue(null, {emitEvent: false});
      })
    ).subscribe();


    this.route.params.subscribe(params => {
      this.brandId = this.route.snapshot.paramMap.get('id');
      this.filters = {
        name: null,
        brandId: this.brandId,
        countryId: null,
      };

      this.brandControl.setValue(this.brandId, {emitEvent: false});
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

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: null,
      brandId: this.brandControl,
      countryId: this.countyControl,
      lineId: this.lineControl
    })
  }

  public openDialog(): void {
    const enterAnimationDuration = '600ms';
    const exitAnimationDuration = '400ms';

    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      data: {
        // brandsOption: this.brandsOption,
        // linesOption: this.linesOption
      },
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
