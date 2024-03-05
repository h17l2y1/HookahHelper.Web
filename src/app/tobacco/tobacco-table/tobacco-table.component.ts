import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {QueryParams} from "../../interfaces/models/queryParams";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {debounceTime, distinctUntilChanged, filter, Observable, switchMap, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LineService} from "../../services/line.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {TobaccoOptions} from "../../interfaces/models/tobacco-options";
import {Tag} from "../../interfaces/entity/tag";
import {TagType} from 'src/app/interfaces/enums/tag-type';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {TobaccoEditorComponent} from "../tobacco-editor/tobacco-editor.component";
import {ConfirmationPopupComponent} from "../../shared/components/confirmation-popup/confirmation-popup.component";
import {TobaccoService} from "../tobacco.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {GetAllResponse} from "../../interfaces/models/get-all-response";
import {MatSort} from "@angular/material/sort";

export interface TobaccoList extends Tobacco {
  tagsDefault: Tag[];
  tagsGlobal: Tag[];
}

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent extends UserPermission implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public readonly tobaccoTableKey: string = 'tobacco_table_state';
  public readonly TableTypes = TableTypes;
  public readonly TagType = TagType;
  public isCardView: boolean = this.getTableState() === TableTypes.Card;
  public totalRows: number = 0;
  public currentPage: number = 0;
  public pageSizeOptions: number[] = [20, 40, 60, 100];
  public pageSize: number = this.pageSizeOptions[0];
  public allColumns: string[] = ['image', 'name', 'description', 'tags', 'globalTags', 'rating', 'action'];
  public displayedColumns: string[] = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);
  public filterOptions: TobaccoOptions = this.route.snapshot.data['filterOptions'];
  public linesOption: Line[] = this.route.snapshot.data['lines'];
  public queryParams: QueryParams = this.route.snapshot.data['queryParam'];
  public brandsOptionsFiltered: Brand[] = this.filterOptions.brands.slice();
  public countriesOptionsFiltered: Country[] = this.filterOptions.countries.slice();
  public tagsOptionsFiltered: Tag[] = this.filterOptions.tags.slice();
  public nameControl: FormControl = this.formBuilder.control(this.queryParams.name);
  public tagControl: FormControl = this.formBuilder.control(this.filterOptions.tags.find(x => x.id === this.queryParams.tagId));
  public brandControl: FormControl = this.formBuilder.control(this.filterOptions.brands.find(x => x.id === this.queryParams.brandId));
  public countryControl: FormControl = this.formBuilder.control(this.filterOptions.countries.find(x => x.id === this.queryParams.countryId));
  public heavinessControl: FormControl = this.formBuilder.control(this.filterOptions.heaviness.find(x => x.id === this.queryParams.heavinessId));
  public lineControl: FormControl = this.formBuilder.control(this.linesOption?.find(x => x.id === this.queryParams?.lineId));
  public filterForm: FormGroup = this.initFilterForm();
  public isMobileMode!: boolean;
  public tobaccos: Tobacco[] = [];
  public tobaccosList!: TobaccoList[];
  public isLoadingResults!: boolean;
  public animation: string = 'progress-dark';
  public skeletonStyle = {
    'border-radius': '5px',
    'height': '50px',
    'background-color': '#262626',
    'border': '1px solid #323232',
    'animation-duration': '2s',
    'margin': '0'
  }
  public skeletonCount = new Array<number>(20).fill(0);
  public skeletonImageStyle = {
    'background-color': '#262626',
    'animation-duration': '2s',
    'margin': '0',
    'height': '100px',
    'width': '230px'
  }
  public skeletonLineStyle = {
    'background-color': '#262626',
    'animation-duration': '2s',
    'margin': '0'
  }

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private lineService: LineService,
    private tobaccoService: TobaccoService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    super(userDataService);
    this.breakpointObserver.observe(["(max-width: 767px)"]).pipe(
      tap((result: BreakpointState) => {
        if (result.matches) {
          this.isMobileMode = result.matches;
        } else {
          this.isMobileMode = result.matches;
        }
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.queryParams.take = this.queryParams.take ? this.queryParams.take : this.pageSize;

    this.nameControl.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      tap(value => {
        this.queryParams.name = value;
        this.redirect();
      })
    ).subscribe();

    this.tagControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.tagsOptionsFiltered = this._filter(this.filterOptions.tags, value);
          return;
        }
        this.queryParams.tagId = this.tagControl.value?.id;
        this.redirect()
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.brandsOptionsFiltered = this._filter(this.filterOptions.brands, value);
          return;
        }
        if (!value) {
          this.lineControl.reset(null, {emitEvent: false});
          this.lineControl.disable();
          this.queryParams.brandId = null;
          this.redirect();
        }
      }),
      filter(Boolean),
      tap(() => {
        this.queryParams.brandId = this.brandControl.value?.id;
      }),
      switchMap(value => this.lineService.getLinesByBrandId(value.id)),
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable({emitEvent: false});
        this.queryParams.lineId = null;
        if (this.linesOption && this.queryParams.lineId) {
          this.lineControl.setValue(this.linesOption.find(x => x.id === this.queryParams.lineId), {emitEvent: false});
        }
        this.redirect();
      })
    ).subscribe();

    this.lineControl.valueChanges.subscribe(value => {
      if (value) {
        this.queryParams.lineId = this.lineControl.value?.id;
        this.redirect();
      }
    });

    this.countryControl.valueChanges.pipe(
      tap(value => {
        if (typeof value === 'string') {
          this.countriesOptionsFiltered = this._filter(this.filterOptions.countries, value);
          return;
        }
        this.queryParams.countryId = this.countryControl.value?.id;
        this.redirect()
      })
    ).subscribe();

    this.heavinessControl.valueChanges.subscribe(() => {
      this.queryParams.heavinessId = this.heavinessControl.value?.id;
      this.redirect();
    });

    this.getTobaccos().subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.isCardView) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      this.sort.sortChange.pipe(
        tap(value => {
          this.queryParams.sortBy = value.direction;
          this.queryParams.type = value.active;
          this.redirect();
        })
      ).subscribe();
    }

    this.paginator.page.pipe(
      tap(value => {
        this.queryParams.page = value.pageIndex;
        this.queryParams.take = value.pageSize;
        this.redirect();
      })
    ).subscribe();
  }

  private getTobaccos(): Observable<GetAllResponse<Tobacco>> {
    this.isLoadingResults = true;
    return this.tobaccoService.getAll2(this.queryParams)
      .pipe(
        tap(response => {
          this.isLoadingResults = false;
          if (response === null) {
            return [];
          }
          this.totalRows = response.total;
          this.tobaccos = response.list
          this.tobaccosList = response.list?.map(tobacco => {
            const tobaccoList = tobacco as TobaccoList;
            tobaccoList.tagsDefault = tobacco.tags.filter(tag => !tag.isGlobal);
            tobaccoList.tagsGlobal = tobacco.tags.filter(tag => tag.isGlobal);
            return tobaccoList;
          })
          return;
        }),
      )
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private redirect(): void {
    this.router.navigate(['/tobaccos/'], {
      queryParams: {...this.queryParams}
    }).then(() => this.getTobaccos().subscribe());
  }

  private initFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: this.nameControl,
      tag: this.tagControl,
      brand: this.brandControl,
      country: this.countryControl,
      line: this.lineControl,
      heaviness: this.heavinessControl
    });
  }

  public displayFn(item: { name: string }): string {
    return item && item.name ? item.name : '';
  }

  public switchTableView(type: TableTypes): boolean {
    localStorage.setItem(this.tobaccoTableKey, type);
    this.isCardView = type === TableTypes.Card
    return this.isCardView;
  }

  private getTableState(): TableTypes {
    const type = localStorage.getItem(this.tobaccoTableKey);
    if (!type) {
      localStorage.setItem(this.tobaccoTableKey, TableTypes.Card);
      return TableTypes.Card
    }
    return type as TableTypes;
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(TobaccoCreateComponent, {
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.redirect();
      }
    });
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    // this.getTobaccos();
  }

  public onView(id: string): void {
    this.router.navigateByUrl(`/tobacco/${id}`).then(() => {
    });
  }

  public onEdit(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoEditorComponent, {
          data: {
            tobacco: response
          },
          maxWidth: '1000px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.getTobaccos();
          }
        });
      }))
      .subscribe();
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.tobaccoService.remove(id).pipe(
          // tap(() => this.getTobaccos())
        ).subscribe();
      }
    });
  }

}
