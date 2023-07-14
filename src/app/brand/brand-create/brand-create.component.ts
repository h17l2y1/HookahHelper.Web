import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {Line} from "../../interfaces/entity/line";
import {NewLine} from "../../interfaces/other/new-line";
import {BrandService} from "../brand.service";

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.scss']
})
export class BrandCreateComponent implements OnInit {
  public createBrandForm: FormGroup = this.initCreateTobaccoForm();
  private tempId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    public dialogRef: MatDialogRef<BrandCreateComponent>,
    private formBuilder: FormBuilder,
    private readonly brandService: BrandService) {
  }

  ngOnInit(): void {
  }

  // TODO! edit country logic
  public onSave(): void {
    const request = this.createBrandForm.value as CreateBrand;
    request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    request.image.name = `brand: ${request.name}`;

    if (request.lines?.length){
      request.lines = undefined
    }

    this.brandService.create(request).subscribe(() => {
      this.dialogRef.close();
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public addImage(item: any): void {
    this.createBrandForm.patchValue({image:{base64: item}})
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
      countryId: [{ value: null, disabled: true }, [Validators.required]],
      lines: this.formBuilder.array([
        this.formBuilder.group({
          tempId: this.formBuilder.control(this.getNextId()),
          name: this.formBuilder.control(null)
        })
      ]),
    });
  };

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
    this.createBrandForm.patchValue({imageBase64: imageBase64});
  }

  get getLines(): FormArray {
    return this.createBrandForm.get('lines') as FormArray;
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
