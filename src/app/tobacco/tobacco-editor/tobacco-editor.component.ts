import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {map, Observable, startWith} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {Tag} from "../../interfaces/entity/tag";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent implements OnInit {
  public editTobaccoForm: FormGroup = this.initEditTobaccoForm();
  public linesOption$: Observable<Line[]> = this.lineService.getLinesByBrandId(this.data.tobacco.brandId);

  separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagControl = new FormControl('');
  filteredTags!: Observable<Tag[]>;
  public usedTags: Tag[] = this.data.tobacco.tags;
  public allTags: Tag[] = [
    {id: '1', name: 'Apple'},
    {id: '2', name: 'Lemon'},
    {id: '3', name: 'Lime'},
    {id: '4', name: 'Orange'},
    {id: '5', name: 'Strawberry'}
  ];
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      tobacco: Tobacco,
      brands$: Observable<Brand[]>,
      heaviness: Heaviness[]
    },
    public dialogRef: MatDialogRef<TobaccoEditorComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private brandService: BrandService,
    private lineService: LineService,
  ) {}

  ngOnInit() {
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allTags.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    //
    // // Add our fruit
    // if (value) {
    //   this.tags.push(value);
    // }

    // Clear the input value
    event.chipInput!.clear();
    this.tagControl.setValue(null);
  }

  public removeTag(tag: Tag): void {
    const index = this.usedTags.indexOf(tag);
    if (index >= 0) {
      this.usedTags.splice(index, 1);
    }
  }

  public selected(tag: Tag): void {
    this.usedTags.push(tag);
    this.fruitInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  private _filter(value: string): Tag[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
  }
  public onSave(): void {
    if (this.editTobaccoForm.invalid) {
      this.editTobaccoForm.markAllAsTouched();
      return;
    }
    const request: Tobacco = this.editTobaccoForm.value;
    request.brandId = this.data.tobacco.brandId;
    this.tobaccoService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
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
}
