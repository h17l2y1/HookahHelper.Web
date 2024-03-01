import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {UserDataSharedService} from "../../../services/shared/user-data-shared.service";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand.service";
import {BrandEditorComponent} from "../../brand-editor/brand-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {tap} from "rxjs";
import {Brand} from "../../../interfaces/entity/brand";
import {Filter} from "../../../interfaces/models/filter";
import {MatSort} from "@angular/material/sort";
import {UserPermission} from "../../../shared/user-permission";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})

export class BrandListComponent extends UserPermission implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public allColumns: string[] = ['image', 'name', 'description', 'country', 'action'];
  public displayedColumns!: string[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [30, 60, 120];
  public pageSize = this.pageSizeOptions[0];
  public isLoadingResults: boolean = false;
  public filter!: Filter;
  public brands: Brand[] = [];

  constructor(
    userDataService: UserDataSharedService,
    public dialog: MatDialog,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute) {
    super(userDataService);
  }

  ngOnInit(): void {
    this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1);

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.filter = {
        name: params.get('name'),
        countryId: params.get('countryId')
      }
      this.getBrands();
    });
  }

  private getBrands(): void {
    const pag = this.paginator ? this.paginator.pageIndex : 0;
    this.isLoadingResults = true;
    this.brandService.getAll(pag, this.pageSize, 'asc', 'name', this.filter)
      .pipe(
        tap((response: GetAllResponse<Brand>) => {
          this.brands = response.list;
          this.totalRows = response.total;
        })
      )
      .subscribe(() => this.isLoadingResults = false);
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getBrands();
  }

  public onUpdate(id: string): void {
    const dialogRef = this.dialog.open(BrandEditorComponent, {
      data: {id: id},
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getBrands();
      }
    });
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.brandService.remove(id).subscribe(() =>
          this.getBrands()
        )}
    });
  }

  public onBrandList(id: string): void {
    this.router.navigate(['/tobaccos/'], { queryParams: { brandId: id } });
  }

}
