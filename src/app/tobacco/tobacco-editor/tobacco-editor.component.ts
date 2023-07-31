import {Component, Inject, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, switchMap, tap} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {HeavinessService} from "../../services/heaviness.service";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent {
  public brandControl: FormControl = this.formBuilder.control({value: this.data.tobacco.brandId, disabled: true});
  public lineControl: FormControl = this.formBuilder.control(this.data.tobacco.lineId);
  public heavinessControl: FormControl = this.formBuilder.control(this.data.tobacco.heavinessId);
  public editTobaccoForm: FormGroup = this.initEditTobaccoForm();
  public linesOption$: Observable<Line[]> = this.lineService.getLinesByBrandId(this.data.tobacco.brandId);

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
  ) {
  }

  public onSave(): void {
    if (this.editTobaccoForm.invalid) {
      this.editTobaccoForm.markAllAsTouched();
      return;
    }
    const request: Tobacco = this.editTobaccoForm.value;
    this.tobaccoService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public initEditTobaccoForm(): FormGroup {
    return  this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        link: null,
        base64: null,
      }),
      name: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      description: [null,Validators.maxLength(256)],
      brandId: this.brandControl,
      lineId: [null, [Validators.required]],
      heavinessId: [null, [Validators.required]],
    });
  };
}
