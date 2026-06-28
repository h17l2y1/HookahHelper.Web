import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../interfaces/entity/line";
import {Observable, tap} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {Tag} from "../../interfaces/entity/tag";
import {HeavinessService} from "../../services/heaviness.service";
import {TobaccoTag} from "../../interfaces/entity/tobacco-tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagService} from "../../tag/tag.service";
import {SearchSelectOption} from "../../shared/components/search-select/search-select.component";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent implements OnInit {
  public readonly aspectRatio: number = 1;
  public editTobaccoForm: FormGroup = this.initEditTobaccoForm();
  public linesOption$: Observable<Line[]> = this.lineService.getLinesByBrandId(this.data.tobacco.brandId);
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public selectedTags: Tag[] = this.data.tobacco.tags.filter(tag => !tag.isGlobal);
  public selectedTasteTags: Tag[] = this.data.tobacco.tags.filter(tag => tag.isGlobal);
  public allTags: Tag[] = [];
  public allTasteTags: Tag[] = [];
  public removedTags: TobaccoTag[] = [];
  public removedTasteTags: TobaccoTag[] = [];

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
      })
    ).subscribe();
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
  }

  public onTagsSelected(tags: SearchSelectOption[]): void {
    this.selectedTags = tags as Tag[];
  }

  public onTasteTagsSelected(tags: SearchSelectOption[]): void {
    this.selectedTasteTags = tags as Tag[];
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

  public get heavinessIdControl(): FormControl {
    return this.editTobaccoForm.get('heavinessId') as FormControl;
  }

  public get lineIdControl(): FormControl {
    return this.editTobaccoForm.get('lineId') as FormControl;
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
