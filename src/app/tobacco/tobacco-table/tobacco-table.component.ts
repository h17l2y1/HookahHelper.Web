import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Filter} from "../../interfaces/models/filter";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, switchMap, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {CountryService} from "../../services/country.service";
import {LineService} from "../../services/line.service";
import {HeavinessService} from "../../services/heaviness.service";
import {ActivatedRoute} from "@angular/router";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {ThemePalette} from "@angular/material/core";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {TobaccoEditorComponent} from "../tobacco-editor/tobacco-editor.component";

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [25, 50, 100];
  public pageSize = this.pageSizeOptions[0];
  public filters!: Filter;
  public tobaccos!: Tobacco[];
  private brandsOption?: Brand[];
  private heavinessOption?: Heaviness[];
  public linesOption: Line[] = [];
  public brands$: Observable<Brand[]> = this.brandService.getOptions()
    .pipe(
      tap(response => this.brandsOption = response)
    );
  public countries$: Observable<Country[]> = this.countryService.getOptions();
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions()
    .pipe(
      tap(response => this.heavinessOption = response)
    );
  public brandId!: string | null;
  public switchControl: FormControl = this.formBuilder.control(true);
  public filterForm!: FormGroup;
  public brandControl: FormControl = this.formBuilder.control('');
  public countyControl: FormControl = this.formBuilder.control('');
  public lineControl: FormControl = this.formBuilder.control({value: '', disabled: true});

  color: ThemePalette = 'accent';
  checked = true;

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    private brandService: BrandService,
    private countryService: CountryService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilterForm();

    this.filterForm.valueChanges.pipe(
      tap((filters: Filter) => {
        this.filters = filters;
        this.getTobaccos();
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      tap(brandId => {
        if (!brandId){
          this.lineControl.reset();
          this.lineControl.disable();
        }
        this.brandId = brandId;
      }),
      filter(Boolean),
      switchMap((brandId) => this.lineService.getLinesByBrandId(brandId as string)),
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable();
      }),
    ).subscribe();

    this.switchControl.valueChanges.pipe(
      tap(result => {
        this.checked = result;
      })
    ).subscribe()

    this.route.params.subscribe(() => {
      this.brandId = this.route.snapshot.paramMap.get('id');
      this.filters = {
        name: null,
        brandId: this.brandId,
        countryId: null,
        lineId: null,
        heavinessId: null
      };

      this.brandControl.setValue(this.brandId, {emitEvent: false});
    });
  }

  ngAfterViewInit(): void {
    this.getTobaccos();
  }

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: null,
      brandId: this.brandControl,
      countryId: this.countyControl,
      lineId: this.lineControl,
      heavinessId: null,
    })
  }

  public getTobaccos(): void {
    this.tobaccoService.getAll(this.paginator.pageIndex, this.pageSize, 'asc', 'name', this.filters)
      .subscribe((data: GetAllResponse<Tobacco>) => {
        this.tobaccos = data.list;
        this.totalRows = data.total
      });
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      data: {
        brandsOption: this.brandsOption,
        linesOption: this.linesOption
      },
      maxWidth: '1000px',
      height: '70%',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.onCreate();
      }
      this.getTobaccos();
    });
  }

  // public onEdit(id: string): void {
  //   this.tobaccoService.getById(id).pipe(
  //     tap(response => {
  //       const dialogRef = this.dialog.open(TobaccoEditorComponent, {
  //         data: {
  //           tobacco: response,
  //           brands$: this.brands$,
  //           heaviness: this.heavinessOption
  //         },
  //         maxWidth: '1000px',
  //         height: '70%',
  //         backdropClass: 'blurred',
  //         enterAnimationDuration: ENTER_ANIMATION_DURATION,
  //         exitAnimationDuration: EXIT_ANIMATION_DURATION
  //       });
  //
  //       dialogRef.afterClosed().subscribe(result => {
  //         if (result){
  //           this.getTobaccos();
  //         }
  //       });
  //     }))
  //     .subscribe();
  // }

}
