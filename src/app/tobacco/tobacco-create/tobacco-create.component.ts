import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {Observable, of, startWith, switchMap, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {HeavinessService} from "../../services/heaviness.service";
import {LineService} from "../../services/line.service";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../../brand/brand.service";
import {Tag} from "../../interfaces/entity/tag";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {TagService} from "../../tag/tag.service";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {ImageType} from "../../interfaces/enums/image-type";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagTasteInput') tagTasteInput!: ElementRef<HTMLInputElement>;
  public readonly aspectRatio: number = 1;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public nameControl: FormControl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  public brandControl: FormControl = this.formBuilder.control('', Validators.required);
  public tagControl = new FormControl('', Validators.required);
  public tagTasteControl = new FormControl('', Validators.required);
  public heavinessControl: FormControl = this.formBuilder.control(null, [Validators.required]);

  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public linesOption!: Line[];
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];
  public selectedTags: Tag[] = [];
  public selectedTasteTags: Tag[] = [];
  public filteredTags!: Tag[];
  public filteredTasteTags!: Tag[];
  public allTags!: Tag[];
  public allTasteTags!: Tag[];
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
      switchMap(() => {
        return this.tagControl.valueChanges.pipe(
          startWith(null),
          tap((value) => {
            if (!value) {
              // filtering tags by default
              this.filteredTags = this.filterTags();
              this.filteredTasteTags = this.filterTasteTags();
              return;
            }
            if (typeof value === 'object') {
              // filtering after select
              const newTag = value as Tag;
              newTag.isNew = true;
              this.selectedTags.push(newTag);
              this.filteredTags = this.filterTags();
              this.tagInput.nativeElement.value = '';
              this.tagControl.setValue(null, {emitEvent: false});
              return;
            }
            // filtering by name when use input
            this.filteredTags = this.filteredTags.filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()));
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
        this.filteredTasteTags = this.filteredTasteTags.filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()));
      }),
    ).subscribe()

    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
        this.filteredBrandsOptions = brands;
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      switchMap((brand: string | Brand) => {
        if (typeof brand === 'object') {
          return this.lineService.getLinesByBrandId(brand.id).pipe(
            tap(lines => {
              this.linesOption = lines;
              this.createTobaccoForm.get('lineId')?.enable();
            }),
          );
        } else {
          this.filteredBrandsOptions = this.filterBrands(brand);
          return of(null);
        }
      })
    ).subscribe();
  }

  public setName(name: string): void {
    this.nameControl.setValue(name);
  }

  public displayFn(brand: Brand): string {
    return brand && brand.name ? brand.name : '';
  }

  public removeTag(removedTag: Tag): void {
    const index = this.selectedTags.indexOf(removedTag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }

    this.filteredTags = this.filterTags();
  }

  public removeTasteTag(removedTag: Tag): void {
    const index = this.selectedTasteTags.indexOf(removedTag);
    if (index >= 0) {
      this.selectedTasteTags.splice(index, 1);
    }

    this.filteredTasteTags = this.filterTasteTags();
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
    const request: Tobacco = this.createTobaccoForm.value;
    request.brandId = this.createTobaccoForm.value.brandId.id;
    request.tags = this.selectedTags;
    const tags = this.selectedTags.concat(this.selectedTasteTags);
    request.tobaccoTags = tags.map(tag => {
      return {
        id: undefined,
        tobaccoId: request.id,
        tagId: tag.id,
        isNew: tag.isNew
      }
    });
    request.tags = this.selectedTags;
    request.image.name = request.name;

    return request;
  }

  public onCancel(): void {
    this.dialogRef.close();
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
      heavinessId: this.heavinessControl,
    });
  };

  private filterBrands(name: string): Brand[] {
    const filterValue = name.toLowerCase();
    return this.allBrandsOption.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private filterTags(): Tag[] {
    return this.allTags.filter(tag => !this.selectedTags.some(selectedTag =>
      selectedTag.name === tag.name) && !tag.isRemoved
    );
  }

  private filterTasteTags(): Tag[] {
    return this.allTasteTags.filter(tag => !this.selectedTasteTags.some(selectedTag =>
      selectedTag.name === tag.name) && !tag.isRemoved
    );
  }

  public onChange(): void {
    this.createTobaccoForm.patchValue({
      name: this.namePipe.transform(this.createTobaccoForm.value.name)
    }, {emitEvent: false});
  }
}
