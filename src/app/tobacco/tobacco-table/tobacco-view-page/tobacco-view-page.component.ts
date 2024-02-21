import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {ReviewService} from "../../../services/review.service";
import {TokenService} from "../../../services/token.service";
import {Review} from "../../../interfaces/entity/review";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {ActivatedRoute} from "@angular/router";

interface UserData {
  isAnonymous: boolean;
  userName: string;
  userId: string | null;
}

@Component({
  selector: 'app-tobacco-view-page',
  templateUrl: './tobacco-view-page.component.html',
  styleUrls: ['./tobacco-view-page.component.scss']
})
export class TobaccoViewPageComponent {
  public userData: UserData = this.getUser();
  public isAnonymousControl: FormControl = this.formBuilder.control(this.userData.isAnonymous, [Validators.required]);
  public nameControl: FormControl = this.formBuilder.control(this.userData.userName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  public createReviewForm: FormGroup = this.initReviewTobaccoForm();
  public tobacco: Tobacco | null = this.route.snapshot.data['tobacco'];

  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
  ) {
  }

  public initReviewTobaccoForm(): FormGroup {
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
    this.reviewService.createReview(request).subscribe();
  }

  private mapRequestModel(): Review {
    return {
      isAnonymous: this.createReviewForm.value.isAnonymous,
      comment: this.createReviewForm.value.text,
      rating: this.createReviewForm.value.rating,
      tobaccoId: this.tobacco?.id,
      name: this.createReviewForm.value.name,
      userId: this.userData.userId
    } as Review;
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
