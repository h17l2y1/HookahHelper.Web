import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Tobacco} from "../../interfaces/entity/tobacco";
import {TobaccoService} from "../tobacco.service";
import {filter, Observable, switchMap, tap} from "rxjs";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {LineService} from "../../services/line.service";
import {BrandService} from "../../brand/brand.service";

@Component({
  selector: 'app-tobacco-create',
  templateUrl: './tobacco-create.component.html',
  styleUrls: ['./tobacco-create.component.scss']
})
export class TobaccoCreateComponent implements OnInit {
  public createTobaccoForm!: FormGroup;
  private tempId: number = 0;

  public brandsOption?: Brand[];
  public linesOption: Line[] = [];
  public brands$: Observable<Brand[]> = this.brandService.getOptions().pipe(
    tap(response => {
      this.brandsOption = response;
    })
  );

  public brandControl = this.formBuilder.control('');
  public lineControl = this.formBuilder.control('');

  public brandId!: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      // brandsOption:Brand[],
      // lineOption: Line[]
    },
    public dialogRef: MatDialogRef<TobaccoCreateComponent>,
    private formBuilder: FormBuilder,
    private readonly tobaccoService: TobaccoService,
    private brandService: BrandService,
    private readonly lineService: LineService,
  ) {
  }


  ngOnInit(): void {
    this.initCreateTobaccoForm();

    this.brandControl.valueChanges.pipe(
      tap(brandId => {
        this.linesOption = [];
        this.brandId = brandId;
      }),
      filter(Boolean),
      switchMap(
        (brandId) => this.lineService.getLinesByBrandId(brandId as string)
      ),
      tap(lines => {
        this.linesOption = lines;
      }),
    ).subscribe();

  //   this.lineControl.valueChanges.pipe(
  //     tap(brandId => {
  //       this.linesOption = [];
  //       this.brandId = brandId;
  //     }),
  //     filter(Boolean),
  //     switchMap(
  //       (brandId) => this.lineService.getLinesByBrandId(brandId as string)
  //     ),
  //     tap(lines => {
  //       this.linesOption = lines;
  //     }),
  //   ).subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private getNextId(): number {
    return ++this.tempId;
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

  private initCreateTobaccoForm(): void {
    this.createTobaccoForm = this.formBuilder.group({
      image: this.formBuilder.group({
        name: null,
        base64: null,
      }),
      name: [null, [Validators.required]],
      description: null,
      brandId: this.brandControl,
      line: this.lineControl
    });
  };
}
