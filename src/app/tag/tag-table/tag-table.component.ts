import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Filter} from "../../interfaces/models/filter";
import {MatTableDataSource} from "@angular/material/table";
import {map, merge, Observable, startWith, switchMap, tap} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../constants";
import {ConfirmationPopupComponent} from "../../shared/components/confirmation-popup/confirmation-popup.component";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {TagCreateComponent} from "../tag-create/tag-create.component";
import {TagEditorComponent} from "../tag-editor/tag-editor.component";
import {TobaccoEditorComponent} from "../../tobacco/tobacco-editor/tobacco-editor.component";

@Component({
  selector: 'app-tag-table',
  templateUrl: './tag-table.component.html',
  styleUrls: ['./tag-table.component.css']
})
export class TagTableComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public readonly displayedColumns: string[] = ['name','action'];
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

  public dataSource!: MatTableDataSource<Tag>;

  constructor(
    public dialog: MatDialog,
    private tagService: TagService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.getTags();
  }

  private getTags(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tagService.getAll(this.paginator.pageIndex, this.pageSize, this.sort.direction, this.sort.active, this.filters)
        }),
        map(data => {
          this.isLoadingResults = false;
          this.totalRows = data.total;
          return data.list;
        }),
      )
      .subscribe((data: Tag[]) => {
        this.dataSource = new MatTableDataSource<Tag>(data);
      });
  }

  public applyFilter(event: Event): void {
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getTags();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(TagCreateComponent, {
      data: null,
      maxWidth: '1000px',
      backdropClass: 'blurred',
      enterAnimationDuration: ENTER_ANIMATION_DURATION,
      exitAnimationDuration: EXIT_ANIMATION_DURATION
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.onCreate();
      }
      this.getTags()
    });
  }

  public onUpdate(id: string): void {
    this.tagService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TagEditorComponent, {
          data: {
            tag: response,
          },
          maxWidth: '1000px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result){
            this.getTags();
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
        this.tagService.remove(id).subscribe(() => this.getTags())
      }
    });
  }
}
