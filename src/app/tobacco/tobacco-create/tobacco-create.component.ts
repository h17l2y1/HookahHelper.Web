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

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public heaviness$: Observable<Heaviness[]> = this.heavinessService.getOptions();
  public brandControl: FormControl = this.formBuilder.control('');
  public linesOption: Line[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { brandId: string, brandsOption:Brand[] },
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
  ) {}


  ngOnInit(): void {
    this.brandControl.valueChanges.pipe(
      tap(brandId => {
        this.linesOption = [];
      }),
      filter(Boolean),
      switchMap((brandId) => this.lineService.getLinesByBrandId(brandId as string)),
      tap(lines => this.linesOption = lines),
    ).subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const request = this.createTobaccoForm.value as Tobacco;
    // request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    // request.image?.name = `brand: ${request.name}`;
    request.image.name = `tobacco: ${request.name}`;


    this.tobaccoService.create(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
      brandId: this.data.brandId,
      heavinessId: null,
    });
  };
}
