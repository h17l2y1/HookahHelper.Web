import {Component, Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TokenService} from "../../services/token.service";
import {Review} from "../../interfaces/entity/review";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {ReviewService} from "../../services/review.service";
import {Mix} from "../../interfaces/entity/mix";
import { StarRatingModule } from 'angular-star-rating';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

interface UserData {
  isAnonymous: boolean;
  userName: string;
  userId: string | null;
}
@Component({
    selector: 'app-mix-view',
    templateUrl: './mix-view.component.html',
    styleUrls: ['./mix-view.component.scss'],
    imports: [StarRatingModule, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, DatePipe]
})
export class MixViewComponent {

  public userData: UserData = this.getUser();
  public isAnonymousControl: FormControl = this.formBuilder.control(this.userData.isAnonymous, [Validators.required]);
  public nameControl: FormControl = this.formBuilder.control(this.userData.userName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  public createReviewForm: FormGroup = this.initCreateMixForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mix: Mix },
    public dialogRef: MatDialogRef<MixViewComponent>,
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private tokenService: TokenService,
  ) {}

  public initCreateMixForm(): FormGroup {

    const form = this.formBuilder.group({
      isAnonymous: this.isAnonymousControl,
      name: this.nameControl,
      text: [null, Validators.maxLength(256)],
      rating: [0, [Validators.required]]
    });
    if (!this.userData.isAnonymous) {
      this.nameControl.disable();
    }
    return form;
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
    let form : Review ={
      isAnonymous: this.createReviewForm.value.isAnonymous,
      comment: this.createReviewForm.value.text,
      rating: this.createReviewForm.value.rating,
      mixId: this.data.mix.id,
      name: this.createReviewForm.value.name,
      userId: this.userData.userId
    } as Review
    return form;
  }

  private getUser(): UserData {
    let user: UserData = {
      isAnonymous: true,
      userName: '',
      userId: null
    }

    const token = this.tokenService.getAccessToken();
    if (token !== null) {
      const decoded = jwtDecode<JwtPayload>(token) as { name: string, userId: string };
      user.isAnonymous = false;
      user.userName = decoded.name;
      user.userId = decoded.userId;
    }
    return user;
  }
}

