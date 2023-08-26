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
import {TagService} from "../../services/tag.service";
import {HeavinessService} from "../../services/heaviness.service";
import {TobaccoTag} from "../../interfaces/entity/tobacco-tag";
import {NamePipe} from "../../shared/pipes/name.pipe";

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
  public filteredTags!: Tag[];
  public selectedTags: Tag[] = this.data.tobacco.tags;
  public allTags!: Tag[];
  public removedTags: TobaccoTag[] = [];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

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
      tap(response => this.allTags = response),
      switchMap(() => {
        return this.tagControl.valueChanges.pipe(
          startWith(null),
          tap((value) => {
            if (!value) {
              // filtering tags by default
              this.filteredTags = this.filter();
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
    request.tobaccoTags = this.selectedTags.map(tag => {
      return {
        id: undefined,
        tobaccoId: request.id,
        tagId: tag.id,
        isNew: tag.isNew
      }
    });
    request.tobaccoTags = request.tobaccoTags.concat(this.removedTags);
    request.tags = this.selectedTags;
    request.image.name = `tobacco: ${request.name}`;

    return request;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public initEditTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.data.tobacco.id, [Validators.required]],
      name: [this.data.tobacco.name, [Validators.required]],
      description: this.data.tobacco.description,
      brandId: {value: this.data.tobacco.brandId, disabled: true},
      lineId: [this.data.tobacco.lineId, [Validators.required]],
      heavinessId: [this.data.tobacco.heavinessId, [Validators.required]],
      image: this.formBuilder.group({
        id: this.data.tobacco.image.id,
        base64: this.data.tobacco.image.base64,
        link: this.data.tobacco.image.link,
      })
    });
  }

  public onChange(): void {
    this.editTobaccoForm.patchValue({
      name: this.namePipe.transform(this.editTobaccoForm.value.name)
    }, {emitEvent: false})
  }
}
