import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {Observable} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {Heaviness} from "../../interfaces/entity/heaviness";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent {
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
