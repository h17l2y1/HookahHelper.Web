import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-tobacco-view',
  templateUrl: './tobacco-view.component.html',
  styleUrls: ['./tobacco-view.component.scss']
})
export class TobaccoViewComponent {

  public createReviewForm: FormGroup = this.initCreateTobaccoForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tobacco: Tobacco },
    public dialogRef: MatDialogRef<TobaccoViewComponent>,
    private formBuilder: FormBuilder
  ) {
    // this. mapDateTime();
  }

  public initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      text: [null, Validators.maxLength(256)],
      rating: [0, [Validators.required]]
    });
  }

  public onSend(): void {
    console.log(this.createReviewForm.value)
  }
}
