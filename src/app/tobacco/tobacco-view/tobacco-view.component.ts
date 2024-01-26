import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Review} from "../../interfaces/entity/review";
import {ReviewService} from "../../services/review.service";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-tobacco-view',
  templateUrl: './tobacco-view.component.html',
  styleUrls: ['./tobacco-view.component.scss']
})
export class TobaccoViewComponent {

  public createReviewForm: FormGroup = this.initCreateTobaccoForm();
  public isAnonymusControl: FormControl = this.formBuilder.control('', [Validators.required]);


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tobacco: Tobacco },
    public dialogRef: MatDialogRef<TobaccoViewComponent>,
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private tokenService: TokenService,
  ) {
  }

  public initCreateTobaccoForm(): FormGroup {

    return this.formBuilder.group({
      isAnonymous: this.isAnonymusControl,
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      text: [null, Validators.maxLength(256)],
      rating: [0, [Validators.required]]
    });
    this.isAnonymusControl.setValue(this.isAnonimus());
  }

  public onSend(): void {
    if (this.createReviewForm.invalid) {
      this.createReviewForm.markAllAsTouched();
      return;
    }
    const request = this.mapRequestModel();
    this.reviewService.createReview(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  private mapRequestModel(): Review {

    return {
      // isAnonymous: this.createReviewForm.value.,
      // anonymousName: string,
      comment: this.createReviewForm.value.text,
      rating: this.createReviewForm.value.rating,
      // tobaccoId: string,
      // user: ReviewUser,
    } as Review
  }

  private isAnonimus(): boolean {
    return this.tokenService.getAccessToken() === null;
  }
}
