import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../brand.service";
import {map, merge, Observable, startWith, switchMap, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {BrandEditorComponent} from "../brand-editor/brand-editor.component";
import {BrandCreateComponent} from "../brand-create/brand-create.component";
import {ConfirmationPopupComponent} from "../../shared/components/confirmation-popup/confirmation-popup.component";
import {Router} from "@angular/router";
import {Filter} from "../../interfaces/models/filter";
import {CountryService} from "../../services/country.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {Country} from "../../interfaces/entity/country";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.scss']
})
export class BrandTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [10, 25, 100];
  public pageSize = this.pageSizeOptions[0];
  public filters: Filter = {
    name: null,
    brandId: null,
    countryId: null
  };
  public isLoadingResults = true;

  public dataSource!: MatTableDataSource<Brand>;
  public countries$: Observable<Country[]> = this.countryService.getOptions();
  public countryControl: FormControl = this.formBuilder.control('');

  constructor(
    public dialog: MatDialog,
    private brandService: BrandService,
    private countryService: CountryService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.countryControl.valueChanges.pipe(
      tap(countryId => {
        this.filters.countryId = countryId
        this.getBrands();
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getBrands();
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getBrands();
  }

  private getBrands(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.brandService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filters)
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
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getBrands();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public create(): void {
    const dialogRef = this.dialog.open(BrandCreateComponent, {
      data: null,
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
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
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getBrands()
      }
    });
  }

  public delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.brandService.remove(id).subscribe(() => this.getBrands())
      }
    });
  }

  public onBrand(id: string): void {
    this.router.navigateByUrl(`/tobacco/${id}`).then(() => {
    });
  }

}
