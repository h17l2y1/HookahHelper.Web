import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {BrandService} from "../brand.service";
import {CountryService} from "../../services/country.service";

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.scss']
})
export class BrandCreateComponent implements OnInit {
  public createBrandForm: FormGroup = this.initCreateBrandForm();
  private tempId: number = 0;
  public countries$ = this.countryService.getOptions();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    public dialogRef: MatDialogRef<BrandCreateComponent>,
    private formBuilder: FormBuilder,
    private readonly brandService: BrandService,
    private readonly countryService: CountryService,
  ) {
  }

  ngOnInit(): void {
  }

  public onSave(): void {
    const request: CreateBrand = this.createBrandForm.value;
    request.lines = request.lines ? request.lines : undefined;
    this.brandService.create(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateBrandForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
      countryId: [null, [Validators.required]],
      lines: this.formBuilder.array([
        this.formBuilder.group({
          tempId: this.formBuilder.control(this.getNextId()),
          name: this.formBuilder.control(null)
        })
      ]),
    });
  };

  private getNextId(): number {
    return ++this.tempId;
  }

  public onRemove(tempId: number): void {
    this.getLines.removeAt(tempId);
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
