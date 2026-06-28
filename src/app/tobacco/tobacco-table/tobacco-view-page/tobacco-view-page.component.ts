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

interface TasteRatingConfig {
  key: TasteRatingKey;
  label: string;
}

interface RadarPoint {
  x: number;
  y: number;
}

interface RadarLabelPoint extends RadarPoint {
  anchor: 'start' | 'middle' | 'end';
  key: TasteRatingKey;
  label: string;
}

type TasteRatingKey =
  | 'sweetness'
  | 'sourness'
  | 'freshness'
  | 'flavorBrightness'
  | 'strength'
  | 'heatResistance'
  | 'smokiness';

@Component({
  selector: 'app-tobacco-view-page',
  templateUrl: './tobacco-view-page.component.html',
  styleUrls: ['./tobacco-view-page.component.scss']
})
export class TobaccoViewPageComponent {
  public readonly radarSize = 360;
  public readonly radarCenter = 180;
  public readonly radarRadius = 118;
  public readonly tasteRatingConfig: TasteRatingConfig[] = [
    {key: 'sweetness', label: 'Сладкость'},
    {key: 'sourness', label: 'Кислость'},
    {key: 'freshness', label: 'Свежесть'},
    {key: 'flavorBrightness', label: 'Яркость вкуса'},
    {key: 'strength', label: 'Крепкость'},
    {key: 'heatResistance', label: 'Жаростойкость'},
    {key: 'smokiness', label: 'Дымность'},
  ];
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
      rating: [0, [Validators.required]],
      sweetness: [0, [Validators.min(0), Validators.max(5)]],
      sourness: [0, [Validators.min(0), Validators.max(5)]],
      freshness: [0, [Validators.min(0), Validators.max(5)]],
      flavorBrightness: [0, [Validators.min(0), Validators.max(5)]],
      strength: [0, [Validators.min(0), Validators.max(5)]],
      heatResistance: [0, [Validators.min(0), Validators.max(5)]],
      smokiness: [0, [Validators.min(0), Validators.max(5)]],
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
    const form = this.createReviewForm.getRawValue();
    return {
      isAnonymous: form.isAnonymous,
      comment: form.text,
      rating: form.rating,
      sweetness: form.sweetness,
      sourness: form.sourness,
      freshness: form.freshness,
      flavorBrightness: form.flavorBrightness,
      strength: form.strength,
      heatResistance: form.heatResistance,
      smokiness: form.smokiness,
      tobaccoId: this.tobacco?.id,
      name: form.name,
      userId: this.userData.userId
    } as Review;
  }

  public getTasteAverage(key: TasteRatingKey): number {
    const reviews = this.tobacco?.reviews ?? [];
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + Number(review[key] ?? 0), 0);
    return Math.round((total / reviews.length) * 100) / 100;
  }

  public getCurrentUserReview(): Review | null {
    if (!this.userData.userId) {
      return null;
    }

    return this.tobacco?.reviews?.find((review) => review.userId === this.userData.userId) ?? null;
  }

  public getRadarAveragePoints(): string {
    return this.buildRadarPoints(this.tasteRatingConfig.map((item) => this.getTasteAverage(item.key)));
  }

  public getRadarUserPoints(): string {
    const review = this.getCurrentUserReview();
    if (!review) {
      return '';
    }

    return this.buildRadarPoints(this.tasteRatingConfig.map((item) => Number(review[item.key] ?? 0)));
  }

  public getRadarLabelPosition(index: number): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
    const angle = this.getAxisAngle(index);
    const labelRadius = this.radarRadius + 42;
    const x = this.radarCenter + Math.cos(angle) * labelRadius;
    const y = this.radarCenter + Math.sin(angle) * labelRadius;

    const normalized = this.normalizeAngle(angle);
    let anchor: 'start' | 'middle' | 'end' = 'middle';
    if (normalized > Math.PI / 2 && normalized < (Math.PI * 3) / 2) {
      anchor = 'end';
    } else if (normalized < Math.PI / 2 || normalized > (Math.PI * 3) / 2) {
      anchor = 'start';
    }

    return { x, y, anchor };
  }

  public getRadarAxisPoints(): RadarPoint[] {
    return this.tasteRatingConfig.map((_, index) => {
      const angle = this.getAxisAngle(index);
      const x = this.radarCenter + Math.cos(angle) * this.radarRadius;
      const y = this.radarCenter + Math.sin(angle) * this.radarRadius;
      return { x, y };
    });
  }

  public getRadarLabelPoints(): RadarLabelPoint[] {
    return this.tasteRatingConfig.map((item, index) => ({
      ...this.getRadarLabelPosition(index),
      key: item.key,
      label: item.label,
    }));
  }

  public getRadarGridRings(): number[] {
    return [0.25, 0.5, 0.75, 1];
  }

  public hasUserReview(): boolean {
    return Boolean(this.getCurrentUserReview());
  }

  public trackReview(_: number, review: Review): string {
    return `${review.userId ?? review.name ?? ''}-${review.creationDate}`;
  }

  public getInitials(name: string | null | undefined): string {
    const safeName = (name ?? '').trim();
    if (!safeName) {
      return '?';
    }

    return safeName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private buildRadarPoints(values: number[]): string {
    return values.map((value, index) => {
      const normalizedValue = Math.max(0, Math.min(5, Number(value)));
      const radius = (normalizedValue / 5) * this.radarRadius;
      const angle = this.getAxisAngle(index);
      const x = this.radarCenter + Math.cos(angle) * radius;
      const y = this.radarCenter + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(' ');
  }

  public getRadarGridPoints(ring: number): string {
    return this.getRadarAxisPoints().map((point) => {
      const scaledX = this.radarCenter + (point.x - this.radarCenter) * ring;
      const scaledY = this.radarCenter + (point.y - this.radarCenter) * ring;
      return `${scaledX},${scaledY}`;
    }).join(' ');
  }

  private getAxisAngle(index: number): number {
    return -Math.PI / 2 + (Math.PI * 2 * index) / this.tasteRatingConfig.length;
  }

  private normalizeAngle(angle: number): number {
    const fullTurn = Math.PI * 2;
    return (angle % fullTurn + fullTurn) % fullTurn;
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
