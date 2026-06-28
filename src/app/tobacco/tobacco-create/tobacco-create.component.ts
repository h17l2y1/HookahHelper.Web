import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {Observable, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {HeavinessService} from "../../services/heaviness.service";
import {LineService} from "../../services/line.service";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../../brand/brand.service";
import {Tag} from "../../interfaces/entity/tag";
import {TagService} from "../../tag/tag.service";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {ImageType} from "../../interfaces/enums/image-type";
import {SearchSelectOption} from "../../shared/components/search-select/search-select.component";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public readonly aspectRatio: number = 1;
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public nameControl: FormControl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  public brandControl: FormControl = this.formBuilder.control(null, Validators.required);
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public linesOption: Line[] = [];
  public allBrandsOption: Brand[] = [];
  public selectedTags: Tag[] = [];
  public selectedTasteTags: Tag[] = [];
  public allTags: Tag[] = [];
  public allTasteTags: Tag[] = [];
  public croppedImage: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: null,
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private brandService: BrandService,
    private tagService: TagService,
    private namePipe: NamePipe,
  ) {
  }

  ngOnInit(): void {
    this.tagService.getOptions().pipe(
      tap(response => {
        this.allTags = response.filter(tag => !tag.isGlobal);
        this.allTasteTags = response.filter(tag => tag.isGlobal);
      }),
    ).subscribe();

    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
      })
    ).subscribe();
  }

  public setName(name: string): void {
    this.nameControl.setValue(name);
  }

  public onBrandSelected(brand: SearchSelectOption | null): void {
    if (!brand) {
      this.linesOption = [];
      this.createTobaccoForm.get('lineId')?.reset();
      this.createTobaccoForm.get('lineId')?.disable();
      return;
    }

    this.lineService.getLinesByBrandId(String(brand.id)).pipe(
      tap(lines => {
        this.linesOption = lines;
        this.createTobaccoForm.get('lineId')?.enable();
        this.createTobaccoForm.get('lineId')?.reset();
      })
    ).subscribe();
  }

  public onTagsSelected(tags: SearchSelectOption[]): void {
    this.selectedTags = tags as Tag[];
  }

  public onTasteTagsSelected(tags: SearchSelectOption[]): void {
    this.selectedTasteTags = tags as Tag[];
  }

  public onSave(oneMore = false): void {
    if (this.createTobaccoForm.invalid) {
      this.createTobaccoForm.markAllAsTouched();
      return;
    }

    const request = this.mapCreateTobaccoRequest();
    this.tobaccoService.create(request).subscribe(() => {
      if (oneMore) {
        this.croppedImage = '';
        this.createTobaccoForm.patchValue({
          name: null,
          description: null,
          image: {
            name: null,
            link: null,
            base64: null,
          }
        })
        this.selectedTags = [];
        return;
      }
      this.dialogRef.close(true);
    });
  }

  private mapCreateTobaccoRequest(): Tobacco {
    const raw = this.createTobaccoForm.getRawValue();
    const request = raw as Tobacco;
    request.brandId = String(raw.brandId);
    request.lineId = String(raw.lineId);
    request.tags = this.selectedTags;
    const tags = this.selectedTags.concat(this.selectedTasteTags);
    request.tobaccoTags = tags.map(tag => {
      return {
        id: undefined,
        tobaccoId: request.id,
        tagId: String(tag.id),
        isNew: Boolean(tag.isNew),
      }
    });
    request.tags = this.selectedTags;
    request.image.name = request.name;

    return request;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public get brandIdControl(): FormControl {
    return this.createTobaccoForm.get('brandId') as FormControl;
  }

  public get heavinessIdControl(): FormControl {
    return this.createTobaccoForm.get('heavinessId') as FormControl;
  }

  public get lineIdControl(): FormControl {
    return this.createTobaccoForm.get('lineId') as FormControl;
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        link: null,
        base64: null,
        type: ImageType.Tobacco,
      }),
      name: this.nameControl,
      description: [null, Validators.maxLength(256)],
      brandId: this.brandControl,
      lineId: [
        {value: null, disabled: true},
        {validators: [Validators.required]}
      ],
      heavinessId: [null, [Validators.required]],
    });
  };

  public onChange(): void {
    this.createTobaccoForm.patchValue({
      name: this.namePipe.transform(this.createTobaccoForm.value.name)
    }, {emitEvent: false});
  }
}
