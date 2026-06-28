import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../interfaces/entity/line";
import {Observable, tap} from "rxjs";
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
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent implements OnInit {
  public readonly aspectRatio: number = 1;
  public tobacco!: Tobacco;
  public editTobaccoForm!: FormGroup;
  public linesOption$!: Observable<Line[]>;
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public selectedTags: Tag[] = [];
  public selectedTasteTags: Tag[] = [];
  public allTags: Tag[] = [];
  public allTasteTags: Tag[] = [];
  public removedTags: TobaccoTag[] = [];
  public removedTasteTags: TobaccoTag[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private tagService: TagService,
    private heavinessService: HeavinessService,
    private namePipe: NamePipe,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tobacco = this.route.snapshot.data['tobacco'];
    this.selectedTags = this.tobacco.tags.filter(tag => !tag.isGlobal);
    this.selectedTasteTags = this.tobacco.tags.filter(tag => tag.isGlobal);
    this.linesOption$ = this.lineService.getLinesByBrandId(this.tobacco.brandId);
    this.editTobaccoForm = this.initEditTobaccoForm();
    this.tagService.getOptions().pipe(
      tap(response => {
        this.allTags = response.filter(tag => !tag.isGlobal);
        this.allTasteTags = response.filter(tag => tag.isGlobal);
      })
    ).subscribe();
  }

  public removeTag(removedTag: Tag): void {
    const exTag = this.tobacco.tobaccoTags?.find(tag => tag.tagId === removedTag.id && !removedTag.isNew);

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
    const exTag = this.tobacco.tobaccoTags?.find(tag => tag.tagId === removedTag.id && !removedTag.isNew);
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
      this.router.navigate(['/tobaccos']);
    });
  }

  private mapRequestModel(): Tobacco {
    const request: Tobacco = this.editTobaccoForm.value;
    request.brandId = this.tobacco.brandId;
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
    this.router.navigate(['/tobaccos']);
  }

  public get heavinessIdControl(): FormControl {
    return this.editTobaccoForm.get('heavinessId') as FormControl;
  }

  public get lineIdControl(): FormControl {
    return this.editTobaccoForm.get('lineId') as FormControl;
  }

  public initEditTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.tobacco.id, [Validators.required]],
      rating: [this.tobacco.rating, [Validators.required]],
      ratingCount: [this.tobacco.ratingCount, [Validators.required]],
      name: [this.tobacco.name, [Validators.required]],
      description: this.tobacco.description,
      brandId: {value: this.tobacco.brandId, disabled: true},
      lineId: [this.tobacco.lineId, [Validators.required]],
      heavinessId: [this.tobacco.heavinessId, [Validators.required]],
      image: this.formBuilder.group({
        id: this.tobacco.image.id,
        base64: this.tobacco.image.base64,
        link: this.tobacco.image.link,
        type: this.tobacco.image.type,
      })
    });
  }

  public onChange(): void {
    this.editTobaccoForm.patchValue({
      name: this.namePipe.transform(this.editTobaccoForm.value.name)
    }, {emitEvent: false})
  }
}
