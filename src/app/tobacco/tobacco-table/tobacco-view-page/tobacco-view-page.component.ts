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

interface Characteristic {
  name: string;
  value: number;
}

interface RadarPoint {
  x: number;
  y: number;
}

interface RadarLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RadarLabel {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  baseline: 'hanging' | 'middle' | 'baseline';
  name: string;
}

@Component({
    selector: 'app-tobacco-view-page',
    templateUrl: './tobacco-view-page.component.html',
    styleUrls: ['./tobacco-view-page.component.scss'],
    standalone: false
})
export class TobaccoViewPageComponent {
  public readonly maxCharacteristicValue = 5;
  public readonly meterSegments = [1, 2, 3, 4, 5];
  public readonly radarSize = 300;
  public readonly radarCenter = this.radarSize / 2;
  public readonly radarRadius = 92;
  public readonly radarLabelRadius = 130;
  public readonly radarRings = [1, 2, 3, 4, 5];
  public readonly characteristics: Characteristic[] = [
    {name: 'Сладкость', value: 5},
    {name: 'Кислость', value: 5},
    {name: 'Пряность', value: 0},
    {name: 'Свежесть', value: 1},
    {name: 'Вкус', value: 2},
    {name: 'Крепкость', value: 4},
    {name: 'Жаростойкость', value: 4},
    {name: 'Дымность', value: 5},
  ];
  public readonly radarAxisLines: RadarLine[] = this.characteristics.map((_, index) => {
    const point = this.getPoint(index, 1, this.radarRadius);
    return {
      x1: this.radarCenter,
      y1: this.radarCenter,
      x2: point.x,
      y2: point.y,
    };
  });
  public readonly radarLabels: RadarLabel[] = this.characteristics.map((item, index) => {
    const point = this.getPoint(index, 1, this.radarLabelRadius);
    const dx = point.x - this.radarCenter;
    const dy = point.y - this.radarCenter;
    return {
      x: point.x,
      y: point.y,
      anchor: Math.abs(dx) < 12 ? 'middle' : dx > 0 ? 'start' : 'end',
      baseline: Math.abs(dy) < 12 ? 'middle' : dy > 0 ? 'hanging' : 'baseline',
      name: item.name,
    };
  });
  public readonly radarValuePoints = this.toPointsString(this.characteristics.map((item, index) =>
    this.getPoint(index, item.value / this.maxCharacteristicValue, this.radarRadius))
  );
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

  public getRingPoints(level: number): string {
    const ratio = level / this.maxCharacteristicValue;
    const points = this.characteristics.map((_, index) => this.getPoint(index, ratio, this.radarRadius));
    return this.toPointsString(points);
  }

  private getPoint(index: number, ratio: number, radius: number): RadarPoint {
    const angle = -Math.PI / 2 + ((Math.PI * 2) / this.characteristics.length) * index;
    return {
      x: this.radarCenter + Math.cos(angle) * radius * ratio,
      y: this.radarCenter + Math.sin(angle) * radius * ratio,
    };
  }

  private toPointsString(points: RadarPoint[]): string {
    return points.map(point => `${point.x},${point.y}`).join(' ');
  }
}
