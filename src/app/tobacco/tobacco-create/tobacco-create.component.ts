import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {BrandService} from "../../brand/brand.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  private tempId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tobacco,
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private readonly tobaccoService: TobaccoService,
  ) {
  }


  ngOnInit(): void {
    console.log('liasgdlagsdahjk')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  public onSave(): void {
    const request = this.createTobaccoForm.value;
    request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    // request.image?.name = `brand: ${request.name}`;

    if (request.lines?.length) {
      request.lines = undefined
    }

    this.tobaccoService.create(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
  public onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
    });
  };
}
