import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../interfaces/entity/line";
import {Observable, startWith, switchMap, tap} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Tag} from "../../interfaces/entity/tag";
import {HeavinessService} from "../../services/heaviness.service";
import {TobaccoTag} from "../../interfaces/entity/tobacco-tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagService} from "../../tag/tag.service";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent implements OnInit {
  public editTobaccoForm: FormGroup = this.initEditTobaccoForm();
  public linesOption$: Observable<Line[]> = this.lineService.getLinesByBrandId(this.data.tobacco.brandId);
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagControl = new FormControl('');
  public tagTasteControl = new FormControl('');
  public selectedTags: Tag[] = this.data.tobacco.tags.filter(tag => !tag.isGlobal);
  public selectedTasteTags: Tag[] = this.data.tobacco.tags.filter(tag => tag.isGlobal);
  public filteredTags!: Tag[];
  public filteredTasteTags!: Tag[];
  public allTags!: Tag[];
  public allTasteTags!: Tag[];
  public removedTags: TobaccoTag[] = [];
  public removedTasteTags: TobaccoTag[] = [];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagTasteInput') tagTasteInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tobacco: Tobacco },
    public dialogRef: MatDialogRef<TobaccoEditorComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private tagService: TagService,
    private heavinessService: HeavinessService,
    private namePipe: NamePipe,
  ) {}

  ngOnInit(): void {
    this.tagService.getOptions().pipe(
      tap(response => {
        this.allTags = response.filter(tag => !tag.isGlobal);
        this.allTasteTags = response.filter(tag => tag.isGlobal);
      }),
      switchMap(() => {
        return this.tagControl.valueChanges.pipe(
          startWith(null),
          tap((value) => {
            if (!value) {
              // filtering tags by default
              this.filteredTags = this.filter();
              this.filteredTasteTags = this.filterTasteTags();
              return;
            }
            if (typeof value === 'object') {
              // filtering after select
              const newTag = value as Tag;
              newTag.isNew = true;
              this.selectedTags.push(newTag);
              this.filteredTags = this.filter();
              this.tagInput.nativeElement.value = '';
              this.tagControl.setValue(null, {emitEvent: false});
              return;
            }
            // filtering by name when use input
            this.filteredTags = this.filteredTags.filter(tag => tag.name.toLowerCase().includes(value));
          }),
        )
      })
    ).subscribe();

    this.tagTasteControl.valueChanges.pipe(
      tap((value) => {
        if (!value) {
          // filtering tags by default
          this.filteredTasteTags = this.filterTasteTags();
          return;
        }
        if (typeof value === 'object') {
          // filtering after select
          const newTag = value as Tag;
          newTag.isNew = true;
          this.selectedTasteTags.push(newTag);
          this.filteredTasteTags = this.filterTasteTags();
          this.tagTasteInput.nativeElement.value = '';
          this.tagTasteControl.setValue(null, {emitEvent: false});
          return;
        }
        // filtering by name when use input
        this.filteredTasteTags = this.filteredTasteTags.filter(tag => tag.name.toLowerCase().includes(value));
      }),
    ).subscribe()
  }

  private filter(): Tag[] {
    return this.allTags.filter(tag => !this.selectedTags.some(selectedTag =>
      selectedTag.name === tag.name) && !tag.isRemoved
    );
  }

  public removeTag(removedTag: Tag): void {
    const exTag = this.data.tobacco.tobaccoTags?.find(tag => tag.tagId === removedTag.id && !removedTag.isNew);

    if (exTag) {
      exTag.isRemoved = true
      this.removedTags.push(exTag)
    }

    const index = this.selectedTags.indexOf(removedTag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }

    this.filteredTags = this.filter();
  }

  public removeTasteTag(removedTag: Tag): void {
    const exTag = this.data.tobacco.tobaccoTags?.find(tag => tag.tagId === removedTag.id && !removedTag.isNew);
    if (exTag) {
      exTag.isRemoved = true
      this.removedTasteTags.push(exTag)
    }

    const index = this.selectedTasteTags.indexOf(removedTag);
    if (index >= 0) {
      this.selectedTasteTags.splice(index, 1);
    }

    this.filteredTasteTags = this.filterTasteTags();
  }

  private filterTasteTags(): Tag[] {
    return this.allTasteTags.filter(tag => !this.selectedTasteTags.some(selectedTag =>
      selectedTag.name === tag.name) && !tag.isRemoved
    );
  }

  public onSave(): void {
    if (this.editTobaccoForm.invalid) {
      this.editTobaccoForm.markAllAsTouched();
      return;
    }
    const request = this.mapRequestModel();
    this.tobaccoService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  private mapRequestModel(): Tobacco {
    const request: Tobacco = this.editTobaccoForm.value;
    request.brandId = this.data.tobacco.brandId;
    request.tags = this.selectedTags;
    const tags = this.selectedTags.concat(this.selectedTasteTags);
    const removedTags = this.removedTags.concat(this.removedTasteTags);
    request.tobaccoTags = tags.map(tag => {
      return {
        id: undefined,
        tobaccoId: request.id,
        tagId: tag.id,
        isNew: tag.isNew
      }
    });
    request.tobaccoTags = request.tobaccoTags.concat(removedTags);
    request.image.name = request.name;

    return request;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public initEditTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.data.tobacco.id, [Validators.required]],
      rating: [this.data.tobacco.rating, [Validators.required]],
      ratingCount: [this.data.tobacco.ratingCount, [Validators.required]],
      name: [this.data.tobacco.name, [Validators.required]],
      description: this.data.tobacco.description,
      brandId: {value: this.data.tobacco.brandId, disabled: true},
      lineId: [this.data.tobacco.lineId, [Validators.required]],
      heavinessId: [this.data.tobacco.heavinessId, [Validators.required]],
      image: this.formBuilder.group({
        id: this.data.tobacco.image.id,
        base64: this.data.tobacco.image.base64,
        link: this.data.tobacco.image.link,
        type: this.data.tobacco.image.type,
      })
    });
  }

  public onChange(): void {
    this.editTobaccoForm.patchValue({
      name: this.namePipe.transform(this.editTobaccoForm.value.name)
    }, {emitEvent: false})
  }
}
