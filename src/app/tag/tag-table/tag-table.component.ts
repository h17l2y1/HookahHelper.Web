import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { QueryParams } from '../../interfaces/models/queryParams';
import { TagService } from '../tag.service';
import { Tag } from '../../interfaces/entity/tag';
import { TagType } from '../../interfaces/enums/tag-type';
import { TagImportRequest } from '../../interfaces/models/tag-import-request';

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
  public isImportPopupOpen = false;
  public isCreatePopupOpen = false;
  public isEditPopupOpen = false;
  public isDeletePopupOpen = false;
  public isImporting = false;
  public isDeleting = false;
  public importError: string | null = null;
  public importJsonControl: FormControl = this.formBuilder.control(this.getDefaultImportJson(), [Validators.required]);
  public tags: Tag[] = [];
  public selectedTagId: string | null = null;
  public selectedTagName: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tagService: TagService,
    private readonly toastr: ToastrService,
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
    this.isCreatePopupOpen = true;
  }

  public onUpdate(id: string): void {
    this.selectedTagId = id;
    this.isEditPopupOpen = true;
  }

  public onDelete(id: string): void {
    const tag = this.tags.find((item) => item.id === id);
    this.selectedTagId = id;
    this.selectedTagName = tag?.name ?? null;
    this.isDeletePopupOpen = true;
  }

  public closeDeletePopup(): void {
    if (this.isDeleting) {
      return;
    }

    this.isDeletePopupOpen = false;
    this.selectedTagId = null;
    this.selectedTagName = null;
  }

  public confirmDelete(): void {
    if (!this.selectedTagId) {
      return;
    }

    this.isDeleting = true;
    this.tagService.remove(this.selectedTagId).pipe(
      finalize(() => {
        this.isDeleting = false;
      }),
    ).subscribe({
      next: () => {
        this.closeDeletePopup();
        this.getTags();
      },
      error: () => {
        this.importError = null;
        this.closeDeletePopup();
        this.toastr.error('Delete failed');
      },
    });
  }

  public openImportPopup(): void {
    this.importError = null;
    this.importJsonControl.setValue(this.getDefaultImportJson());
    this.importJsonControl.markAsPristine();
    this.isImportPopupOpen = true;
  }

  public closeImportPopup(): void {
    if (this.isImporting) {
      return;
    }

    this.isImportPopupOpen = false;
    this.importError = null;
  }

  public closeCreatePopup(): void {
    this.isCreatePopupOpen = false;
  }

  public closeEditPopup(): void {
    this.isEditPopupOpen = false;
    this.selectedTagId = null;
  }

  public handleTagSaved(): void {
    this.closeCreatePopup();
    this.closeEditPopup();
    this.getTags();
  }

  public onImportJson(): void {
    const payload = this.parseImportJson();
    if (!payload) {
      return;
    }

    this.isImporting = true;
    this.importError = null;

    this.tagService.importTags(payload).pipe(
      finalize(() => {
        this.isImporting = false;
      }),
    ).subscribe({
      next: (result) => {
        this.toastr.success(`Imported ${result.createdCount} of ${result.totalCount} tags`);
        this.isImportPopupOpen = false;
        this.getTags();
      },
      error: () => {
        this.importError = 'Import failed. Check JSON structure and try again.';
      },
    });
  }

  public onBackdropClick(): void {
    this.closeImportPopup();
  }

  protected readonly TagType = TagType;

  private parseImportJson(): TagImportRequest[] | null {
    const rawJson = String(this.importJsonControl.value ?? '').trim();
    if (!rawJson) {
      this.importError = 'Paste a JSON array of tags.';
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      this.importError = 'Invalid JSON. Expected an array of tag objects.';
      return null;
    }

    if (!Array.isArray(parsed)) {
      this.importError = 'JSON must be an array of tags.';
      return null;
    }

    const payload: TagImportRequest[] = [];
    for (let index = 0; index < parsed.length; index++) {
      const item = parsed[index];
      if (!item || typeof item !== 'object') {
        this.importError = `Tag at index ${index} is not an object.`;
        return null;
      }

      const record = item as Record<string, unknown>;
      const name = typeof record['name'] === 'string' ? record['name'].trim() : '';
      const color = typeof record['color'] === 'string' ? record['color'].trim() : '';
      const isGlobal = typeof record['isGlobal'] === 'boolean' ? record['isGlobal'] : false;

      if (!name || !color) {
        this.importError = `Tag at index ${index} must contain name and color fields.`;
        return null;
      }

      payload.push({ name, color, isGlobal });
    }

    if (!payload.length) {
      this.importError = 'JSON array is empty.';
      return null;
    }

    return payload;
  }

  private getDefaultImportJson(): string {
    return JSON.stringify([
      {
        name: 'Sample Tag',
        color: '#595959',
      },
    ], null, 2);
  }
}
