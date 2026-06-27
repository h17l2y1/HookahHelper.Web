import {Component, OnInit} from '@angular/core';
import {QueryParams} from "../interfaces/models/queryParams";
import {Mix} from "../interfaces/entity/mix";
import {TopMixService} from "./top-mix.service";
import {tap} from "rxjs";
import {UserDataSharedService} from "../services/shared/user-data-shared.service";
import {UserPermission} from "../shared/user-permission";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-mix',
  templateUrl: './top-mix.component.html',
  styleUrls: ['./top-mix.component.scss']
})
export class TopMixComponent extends UserPermission implements OnInit {
  public isAdmin: boolean = false;
  public readonly allColumns: string[] = ['name', 'rating', 'action'];
  public displayedColumns!: string[];
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [30, 60, 120];
  public pageSize = this.pageSizeOptions[0];
  public filters: QueryParams = {
    name: null,
  };
  public isLoadingResults = true;
  public mixes: Mix[] = [];

  constructor(
    userDataService: UserDataSharedService,
    private mixService: TopMixService,
    private router: Router) {
    super(userDataService);
  }

  ngOnInit(): void {
    this.displayedColumns = this.user?.isAdmin ? this.allColumns : this.allColumns.slice(0, -1)
    this.getMixes();
  }

  public getMixes(): void {
    this.isLoadingResults = true;
    this.mixService.getAll(this.currentPage, this.pageSize, 'asc', 'name', this.filters).pipe(
      tap(data => {
        this.isLoadingResults = false;
        this.totalRows = data.total;
        this.mixes = data.list;
      })
    ).subscribe();
  }

  public applyFilter(event: Event): void {
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 0;
    this.getMixes();
  }

  public onView(id: string): void {
    this.router.navigate(['/mixes/view', id]);
  }

  public notAdminView(id: string): void {
    if (!this.isAdmin)
      this.onView(id);
  }

  public prevPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 0);
    this.getMixes();
  }

  public nextPage(): void {
    this.currentPage = this.currentPage + 1;
    this.getMixes();
  }

  public setPageSize(value: string): void {
    this.pageSize = Number(value);
    this.currentPage = 0;
    this.getMixes();
  }
}
