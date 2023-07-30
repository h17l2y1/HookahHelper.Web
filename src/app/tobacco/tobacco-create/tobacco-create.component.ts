import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {filter, Observable, switchMap, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {Heaviness} from "../../interfaces/entity/heaviness";
import {HeavinessService} from "../../services/heaviness.service";
import {LineService} from "../../services/line.service";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../../brand/brand.service";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public brandControl: FormControl = this.formBuilder.control(this.data.brandId);
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public linesOption: Line[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { brandId: string, brandsOption: Brand[] },
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
  ) {}

  ngOnInit(): void {
    this.brandControl.valueChanges.pipe(
      filter(Boolean),
      switchMap((brandId) => this.lineService.getLinesByBrandId(brandId as string)),
      tap(lines => {
        this.linesOption = lines;
        this.createTobaccoForm.get('lineId')?.enable();
      }),
    ).subscribe();
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        link: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
      brandId: this.brandControl,
      lineId: {value: null, disabled: true},
      heavinessId: null,
    });
  };

  public onSave(oneMore?: boolean): void {
    const request = this.createTobaccoForm.value as Tobacco;
    this.tobaccoService.create(request).subscribe(() => {
      this.dialogRef.close(oneMore);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

}
