import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Filter} from "../../interfaces/models/filter";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {filter, map, Observable, startWith, switchMap, tap} from "rxjs";
import {Country} from "../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LineService} from "../../services/line.service";
import {ActivatedRoute} from "@angular/router";
import {TobaccoCreateComponent} from "../tobacco-create/tobacco-create.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {UserDataSharedService} from "../../services/shared/user-data-shared.service";
import {TableTypes} from "../../interfaces/enums/table-type";
import {UserPermission} from "../../shared/user-permission";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {FilterSharedService} from "../filter-shared.service";
import {TobaccoOptions} from "../../interfaces/models/tobacco-options";
import {Tag} from "../../interfaces/entity/tag";
import {Heaviness} from "../../interfaces/entity/heaviness";

interface FilterData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent extends UserPermission implements OnInit, AfterViewInit {
  public readonly tobaccoTableKey: string = 'tobacco_table_state';
  public readonly TableTypes = TableTypes;
  public brandId: string | null = this.route.snapshot.data['brandId'];
  public filterOptions: TobaccoOptions = this.route.snapshot.data['options'];
  public isTableViewCard: boolean = this.getTableState() === TableTypes.Card;
  public brandsOptionsFiltered: Brand[] = this.filterOptions.brands.slice();
  public countriesOptionsFiltered: Country[] = this.filterOptions.countries.slice();
  public tagsOptionsFiltered: Tag[] = this.filterOptions.tags.slice();
  public linesOption: Line[] = [];
  public tagControl: FormControl = this.formBuilder.control<string | Tag>('');
  public brandControl: FormControl = this.formBuilder.control<string | Brand>('');
  public countryControl: FormControl = this.formBuilder.control<string | Country>('');
  public heavinessControl: FormControl = this.formBuilder.control<string | Heaviness>('');
  public lineControl: FormControl = this.formBuilder.control<string | Line>({value: '', disabled: true});
  public isMobileMode!: boolean;
  public filterForm: FormGroup = this.initFilterForm();

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('brandInput') brandInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') countryInput!: ElementRef<HTMLInputElement>;

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private lineService: LineService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private filterSharedService: FilterSharedService
  ) {
    super(userDataService);
    this.breakpointObserver.observe(["(max-width: 768px)"]).pipe(
      tap((result: BreakpointState) => {
        if (result.matches) {
          this.isMobileMode = result.matches;
        } else {
          this.isMobileMode = result.matches;
        }
      })
    ).subscribe();
  }

  public onBrandSelect(clear?: boolean): void {
    const filterValue: FilterData | null = this.brandControl.value;
    if (!filterValue) {
      return;
    }
    this.brandsOptionsFiltered = this.filterOptions.brands.slice();
    if (!filterValue.id || clear){
      this.brandControl.reset();
      this.lineControl.reset();
      this.lineControl.disable();
      this.filterSharedService.setFilters(this.filterForm.value);
      return;
    }
    this.filterSharedService.setFilters(this.filterForm.value);
    this.lineService.getLinesByBrandId(filterValue.id).pipe(
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable({emitEvent: false});
        this.lineControl.setValue('', {emitEvent: false});
      })
    ).subscribe();
  }

  public onBrandFilter(): void {
    const filterValue: string = this.brandInput.nativeElement.value.toLowerCase();
    this.brandsOptionsFiltered = this.filterOptions.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));
  }

  public onTagFilter(): void {
    const filterValue: string = this.tagInput.nativeElement.value.toLowerCase();
    this.tagsOptionsFiltered = this.filterOptions.tags.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }

  public onTagSelect(clear?: boolean): void {
    const filterValue: FilterData | null = this.tagControl.value;
    if (!filterValue) {
      return;
    }
    this.tagsOptionsFiltered = this.filterOptions.tags.slice();
    if (!filterValue.id || clear){
      this.tagControl.reset();
      this.filterSharedService.setFilters(this.filterForm.value);
      return;
    }
    this.filterSharedService.setFilters(this.filterForm.value);
  }

  public onCountryFilter(): void {
    const filterValue: string = this.countryInput.nativeElement.value.toLowerCase();
    this.countriesOptionsFiltered = this.filterOptions.countries.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }

  public onCountrySelect(clear?: boolean): void {
    const filterValue: FilterData | null = this.countryControl.value;
    if (!filterValue) {
      return;
    }
    this.countriesOptionsFiltered = this.filterOptions.countries.slice();
    if (!filterValue.id || clear){
      this.countryControl.reset();
      this.filterSharedService.setFilters(this.filterForm.value);
      return;
    }
    this.filterSharedService.setFilters(this.filterForm.value);
  }

  ngAfterViewInit(): void {
    this.filterSharedService.getFilters.pipe(
      tap(value => {
        console.log('getFilters', value)
        if (value.brand && value.line){
          this.lineControl.enable({emitEvent: false});
          this.lineControl.setValue(value,{emitEvent: false});
        }
        this.filterForm.patchValue(value, {emitEvent: false});
        this.heavinessControl.setValue(value.heaviness, {emitEvent: false});
      }),
      filter(value => value?.brand?.id !== null && value?.brand?.id !== undefined),
      switchMap(value => this.lineService.getLinesByBrandId(value?.brand?.id)),
      tap(lines => this.linesOption = lines)
    ).subscribe();
  }

  ngOnInit(): void {
    this.lineControl.valueChanges.pipe(
      tap(value => {
        this.lineControl.setValue(value,{emitEvent: false});
        this.filterSharedService.setFilters(this.filterForm.value);
      })
    ).subscribe()

    this.heavinessControl.valueChanges.pipe(
      tap(value => {
        this.heavinessControl.setValue(value,{emitEvent: false});
        this.filterSharedService.setFilters(this.filterForm.value);
      })
    ).subscribe()

    // if (this.brandId) {
    //   const brand = this.allBrandsOption.find(x => x.id === this.brandId);
    //   this.brandAutocompleteControl.setValue(brand, {emitEvent: false});
    // }
  }

  public displayFn(item: { name: string }): string {
    return item && item.name ? item.name : '';
  }

  public switchTableView(type: TableTypes): boolean {
    localStorage.setItem(this.tobaccoTableKey, type);
    this.isTableViewCard = type === TableTypes.Card
    return this.isTableViewCard;
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
        // this.getTobaccos();
      }
    });
  }

  private initFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: '',
      tag: this.tagControl,
      brand: this.brandControl,
      country: this.countryControl,
      line: this.lineControl,
      heaviness: this.heavinessControl
    });
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
