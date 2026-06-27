import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryParams } from '../../interfaces/models/queryParams';
import { TagService } from '../tag.service';
import { Tag } from '../../interfaces/entity/tag';
import { TagType } from '../../interfaces/enums/tag-type';

@Component({
  selector: 'app-tag-table',
  templateUrl: './tag-table.component.html',
  styleUrls: ['./tag-table.component.scss']
})
export class TagTableComponent implements OnInit {
  public totalRows = 0;
  public currentPage = 0;
  public pageSizeOptions = [30, 60, 120];
  public pageSize = this.pageSizeOptions[0];
  public filters: QueryParams = { name: null };
  public isLoadingResults = true;
  public tags: Tag[] = [];

  constructor(
    private readonly tagService: TagService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.getTags();
  }

  public getTags(): void {
    this.isLoadingResults = true;
    this.tagService.getAll(this.currentPage, this.pageSize, 'asc', 'name', this.filters).subscribe(data => {
      this.isLoadingResults = false;
      this.totalRows = data.total;
      this.tags = data.list;
    });
  }

  public handlePageEvent(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.getTags();
  }

  public applyFilter(event: Event): void {
    this.filters.name = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 0;
    this.getTags();
  }

  public onCreate(): void {
    void this.router.navigate(['/tags/create']);
  }

  public onUpdate(id: string): void {
    void this.router.navigate(['/tags/edit', id]);
  }

  public onDelete(id: string): void {
    if (window.confirm('Delete this tag?')) {
      this.tagService.remove(id).subscribe(() => this.getTags());
    }
  }

  protected readonly TagType = TagType;
}
