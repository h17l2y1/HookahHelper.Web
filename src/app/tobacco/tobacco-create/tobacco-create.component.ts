import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {Observable} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  private tempId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { brandId: string, brandsOption:Brand[] },
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
    const request = this.createTobaccoForm.value as Tobacco;
    // request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    // request.image?.name = `brand: ${request.name}`;
    request.image.name = `tobacco: ${request.name}`;


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
      brandId: this.data.brandId,
    });
  };
}
