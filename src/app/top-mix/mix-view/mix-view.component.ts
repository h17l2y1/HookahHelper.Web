import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TokenService} from "../../services/token.service";
import {Review} from "../../interfaces/entity/review";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {ReviewService} from "../../services/review.service";
import {Mix} from "../../interfaces/entity/mix";
import {ActivatedRoute, Router} from "@angular/router";
import {TopMixService} from "../top-mix.service";
import {tap} from "rxjs";

interface UserData {
  isAnonymous: boolean;
  userName: string;
  userId: string | null;
}
@Component({
  selector: 'app-mix-view',
  templateUrl: './mix-view.component.html',
  styleUrls: ['./mix-view.component.scss']
})
export class MixViewComponent implements OnInit {

  public mix!: Mix;
  public userData: UserData = this.getUser();
  public isAnonymousControl: FormControl = this.formBuilder.control(this.userData.isAnonymous, [Validators.required]);
  public nameControl: FormControl = this.formBuilder.control(this.userData.userName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  public createReviewForm: FormGroup = this.initCreateMixForm();

  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private mixService: TopMixService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        const id = params.get('id');
        if (!id) {
          return;
        }
        this.mixService.getById(id).subscribe(response => {
          this.mix = response;
        });
      })
    ).subscribe();
  }

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
      this.router.navigate(['/mixes']);
    });
  }

  private mapRequestModel(): Review {
    let form : Review ={
      isAnonymous: this.createReviewForm.value.isAnonymous,
      comment: this.createReviewForm.value.text,
      rating: this.createReviewForm.value.rating,
      mixId: this.mix.id,
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
