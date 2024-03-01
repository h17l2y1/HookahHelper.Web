import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {tap} from "rxjs";
import {Filter} from "../../../interfaces/models/filter";
import {Brand} from "../../../interfaces/entity/brand";
import {MatDialog} from "@angular/material/dialog";
import {BrandService} from "../../brand.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";

@Component({
  selector: 'app-brand-cards',
  templateUrl: './brand-cards.component.html',
  styleUrls: ['./brand-cards.component.scss']
})
export class BrandCardsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
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

}
