import {Component, OnInit} from '@angular/core';
import {Filter} from "../../interfaces/models/filter";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from "rxjs";
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

@Component({
  selector: 'app-tobacco-table',
  templateUrl: './tobacco-table.component.html',
  styleUrls: ['./tobacco-table.component.scss']
})
export class TobaccoTableComponent extends UserPermission implements OnInit {
  public readonly tobaccoTableKey: string = 'tobacco_table_state';
  public readonly TableTypes = TableTypes;
  public isTableViewCard: boolean = this.getTableState() === TableTypes.Card;
  public isMobileMode!: boolean;
  public filterOptions: TobaccoOptions = this.route.snapshot.data['filterOptions'];
  public linesOption: Line[] = this.route.snapshot.data['lines'];
  public filter: Filter = this.route.snapshot.data['queryParam'];
  public brandsOptionsFiltered: Brand[] = this.filterOptions.brands.slice();
  public countriesOptionsFiltered: Country[] = this.filterOptions.countries.slice();
  public tagsOptionsFiltered: Tag[] = this.filterOptions.tags.slice();
  public nameControl: FormControl = this.formBuilder.control(this.filter.name);
  public tagControl: FormControl = this.formBuilder.control(this.filterOptions.tags.find(x => x.id === this.filter.tagId));
  public brandControl: FormControl = this.formBuilder.control(this.filterOptions.brands.find(x => x.id === this.filter.brandId));
  public countryControl: FormControl = this.formBuilder.control(this.filterOptions.countries.find(x => x.id === this.filter.countryId));
  public heavinessControl: FormControl = this.formBuilder.control(this.filterOptions.heaviness.find(x => x.id === this.filter.heavinessId));
  public lineControl: FormControl = this.formBuilder.control(this.linesOption?.find(x => x.id === this.filter?.lineId));
  public filterForm: FormGroup = this.initFilterForm();

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private lineService: LineService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
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

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(() => this.redirect());

    this.tagControl.valueChanges.subscribe(() => this.redirect());
    this.brandControl.valueChanges.pipe(
      tap(value => {
        if (!value) {
          this.lineControl.reset();
          this.lineControl.disable();
        }
      }),
      filter(Boolean),
      switchMap(value => this.lineService.getLinesByBrandId(value.id)),
      tap(lines => {
        this.linesOption = lines;
        this.lineControl.enable();
        this.filter.lineId = null;
        if (this.linesOption && this.filter.lineId) {
          this.lineControl.setValue(this.linesOption.find(x => x.id === this.filter.lineId));
        }
      })
    ).subscribe(() => {
      this.redirect();
    });
    this.lineControl.valueChanges.subscribe(() => this.redirect());
    this.countryControl.valueChanges.subscribe(() => this.redirect());
    this.heavinessControl.valueChanges.subscribe(() => this.redirect());
  }

  private redirect(): void {
    this.router.navigate(['/tobaccos/'], {
      queryParams: {
        name: this.nameControl.value,
        tagId: this.tagControl.value?.id,
        brandId: this.brandControl.value?.id,
        countryId: this.countryControl.value?.id,
        lineId: this.lineControl.value?.id,
        heavinessId: this.heavinessControl.value?.id,
      }
    });
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
        this.redirect();
      }
    });
  }

}
