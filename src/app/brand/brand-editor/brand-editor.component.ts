import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../brand.service";
import {combineLatest, forkJoin, map, switchMap, take, tap} from "rxjs";
import {CountryService} from "../../services/country.service";
import {Country} from "../../interfaces/entity/country";
import {GetAllResponse} from "../../interfaces/models/get-all-response";

@Component({
  selector: 'app-brand-editor',
  templateUrl: './brand-editor.component.html',
  styleUrls: ['./brand-editor.component.scss']
})
export class BrandEditorComponent implements OnInit {
  public brandForm!: FormGroup;
  private tempId: number = 0;
  private resp!: GetAllResponse<Country>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<BrandEditorComponent>,
    private formBuilder: FormBuilder,
    private readonly countryService: CountryService,
    private readonly brandService: BrandService) {
  }

  ngOnInit(): void {
    this.getUpdateData();
  }

  private getUpdateData(): void {
    const brand$ = this.brandService.getById(this.data.id);
    const options$ = this.countryService.getAll();

    forkJoin([brand$.pipe(
      tap(res => {
        this.brandForm = this.initBrandForm(res);
      })
    ), options$]).subscribe();
  }

  // TODO! edit country logic
  public onSave(): void {
    const request = this.brandForm.value as CreateBrand;
    request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    request.image.name = `brand: ${request.name}`;

    if (request.lines?.length) {
      request.lines = undefined
    }

    this.brandService.update(request).subscribe(() => {
      this.dialogRef.close();
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public addImage(item: any): void {
    this.brandForm.patchValue({image: {base64: item}})
  }

  private initBrandForm(brand: Brand): FormGroup {
    return this.formBuilder.group({
      id: brand.id,
      image: this.formBuilder.group({
        id: brand.image?.id,
        name: brand.image?.name,
        base64: brand.image?.base64,
      }),
      name: [brand.name, [Validators.required]],
      description: brand.description,
      countryId: [{value: brand.country.name, disabled: true}, [Validators.required]],
      lines: brand.lines ? this.setLines(brand.lines) : [],
    });
  };

  private setLines(lines: Line[]): FormArray {
    const arr = lines.map(line => {
      return this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        id: this.formBuilder.control(line.id),
        name: this.formBuilder.control(line.name)
      })
    })

    return this.formBuilder.array(arr);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  public onRemove(tempId: number): void {
    this.getLines.removeAt(tempId);
  }

  public setImage(imageBase64: string | ArrayBuffer): void {
    this.brandForm.patchValue({imageBase64: imageBase64});
  }

  get getLines(): FormArray {
    return this.brandForm.get('lines') as FormArray;
  }

  public addLine(): void {
    this.getLines.push(
      this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        name: this.formBuilder.control('')
      })
    );
  }
}
