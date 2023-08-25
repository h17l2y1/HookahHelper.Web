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

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public brandControl: FormControl = this.formBuilder.control('', Validators.required);
  public tagControl = new FormControl('', Validators.required);
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public linesOption!: Line[];
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];
  public selectedTags: Tag[] = [];
  public filteredTags!: Tag[];
  public allTags!: Tag[];

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
      tap(response => this.allTags = response),
      switchMap(() => {
        return this.tagControl.valueChanges.pipe(
          startWith(null),
          tap((value) => {
            if (!value) {
              // filtering tags by default
              this.filteredTags = this.filterTags();
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
            this.filteredTags = this.filteredTags.filter(tag => tag.name.toLowerCase().includes(value));
          }),
        )
      })
    ).subscribe();

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

  public onSave(oneMore = false): void {
    if (this.createTobaccoForm.invalid) {
      this.createTobaccoForm.markAllAsTouched();
      return;
    }

    const request = this.mapCreateTobaccoRequest();
    this.tobaccoService.create(request).subscribe(() => {
      const res = {oneMore: oneMore, isCreated: true};
      this.dialogRef.close(res);
    });
  }

  private mapCreateTobaccoRequest(): Tobacco {
    const request: Tobacco = this.createTobaccoForm.value;
    request.brandId = this.createTobaccoForm.value.brandId.id;
    request.tobaccoTags = this.selectedTags.map(tag => {
      return {
        id: undefined,
        tobaccoId: request.id,
        tagId: tag.id,
        isNew: tag.isNew
      }
    });
    request.tags = this.selectedTags;
    request.image.name = `tobacco: ${request.name}`;

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
      }),
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [null, Validators.maxLength(256)],
      brandId: this.brandControl,
      lineId: [
        {value: null, disabled: true},
        {validators: [Validators.required]}
      ],
      heavinessId: [null, [Validators.required]],
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

  public onChange(): void {
    this.createTobaccoForm.patchValue({
      name: this.namePipe.transform(this.createTobaccoForm.value.name)
    }, {emitEvent: false});
  }
}
