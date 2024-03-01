import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {tap} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {Filter} from "../../../interfaces/models/filter";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-tobacco-table-card',
  templateUrl: './tobacco-table-card.component.html',
  styleUrls: ['./tobacco-table-card.component.scss']
})
export class TobaccoTableCardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public brandId: string | null = this.route.snapshot.data['brandId'];
  public filter?: Filter | null;
  public tobaccos!: Tobacco[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [23, 40, 60, 100];
  public pageSize = this.pageSizeOptions[0];
  public isLoadingResults!: boolean;

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.filter = {
        name: params.get('name'),
        tagId: params.get('tagId'),
        brandId: params.get('brandId'),
        countryId: params.get('countryId'),
        lineId: params.get('lineId'),
        heavinessId: params.get('heavinessId'),
      }
      this.getTobaccos();
    });
  }

  public handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.getTobaccos();
  }

  public getTobaccos(): void {
    const pag = this.paginator ? this.paginator.pageIndex : 0;
    this.isLoadingResults = true;
    this.tobaccoService.getAll(pag, this.pageSize, 'asc', 'name', this.filter)
      .pipe(
        tap((response: GetAllResponse<Tobacco>) => {
          this.tobaccos = response.list;
          this.totalRows = response.total;
        })
      )
      .subscribe(() => this.isLoadingResults = false);
  }
}
