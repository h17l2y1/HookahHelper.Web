import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {Observable, of, switchMap, tap} from "rxjs";
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
  public brandControl: FormControl = this.formBuilder.control('', Validators.required);
  public createTobaccoForm: FormGroup = this.initCreateTobaccoForm();
  public linesOption!: Line[];
  public allBrandsOption!: Brand[];
  public filteredBrandsOptions!: Brand[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: null,
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private tobaccoService: TobaccoService,
    private lineService: LineService,
    private heavinessService: HeavinessService,
    private brandService: BrandService,
  ) {}

  ngOnInit(): void {
    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
        this.filteredBrandsOptions = brands;
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      switchMap((brand: string | Brand) => {
        if (typeof brand === 'object') {
          return this.lineService.getLinesByBrandId(brand.id).pipe(
            tap(lines => {
              this.linesOption = lines;
              this.createTobaccoForm.get('lineId')?.enable();
            }),
          );
        } else {
          this.filteredBrandsOptions = this._filter(brand);
          return of(null);
        }
      })
    ).subscribe();
  }

  public displayFn(brand: Brand): string {
    return brand && brand.name ? brand.name : '';
  }

  public onSave(oneMore?: boolean): void {
    if (this.createTobaccoForm.invalid) {
      this.createTobaccoForm.markAllAsTouched();
      return;
    }
    const request: Tobacco = this.createTobaccoForm.value;
    request.brandId = this.createTobaccoForm.value.brandId.id;
    this.tobaccoService.create(request).subscribe(() => {
      this.dialogRef.close(oneMore);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        link: null,
        base64: null,
      }),
      name: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      description: [null,Validators.maxLength(256)],
      brandId: this.brandControl,
      lineId: [
        {value: null, disabled: true},
        {validators: [Validators.required]}
      ],
      heavinessId: [null, [Validators.required]],
    });
  };

  private _filter(name: string): Brand[] {
    const filterValue = name.toLowerCase();
    return this.allBrandsOption.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
