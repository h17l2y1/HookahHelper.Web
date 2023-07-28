import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Brand} from "../../interfaces/entity/brand";
import {Line} from "../../interfaces/entity/line";
import {filter, Observable, switchMap, tap} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TobaccoService} from "../tobacco.service";
import {BrandService} from "../../brand/brand.service";
import {LineService} from "../../services/line.service";
import {Tobacco} from "../../interfaces/entity/tobacco";

@Component({
  selector: 'app-tobacco-editor',
  templateUrl: './tobacco-editor.component.html',
  styleUrls: ['./tobacco-editor.component.scss']
})
export class TobaccoEditorComponent implements OnInit {
  public editTobaccoForm!: FormGroup;
  private tempId: number = 0;

  public brandsOption?: Brand[];
  public linesOption: Line[] = [];
  public brands$: Observable<Brand[]> = this.brandService.getOptions().pipe(
    tap(response => {
      this.brandsOption = response;
    })
  );
  public tobacco!: Tobacco;

  public brandControl = this.formBuilder.control('');
  public lineControl = this.formBuilder.control('');

  public brandId!: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      // brandsOption:Brand[],
      // lineOption: Line[]
      tobaccoId: string
    },
    public dialogRef: MatDialogRef<TobaccoEditorComponent>,
    private formBuilder: FormBuilder,
    private readonly tobaccoService: TobaccoService,
    private brandService: BrandService,
    private readonly lineService: LineService,
  ) {
  }


  ngOnInit(): void {
    // this.initEditTobaccoForm();
    this.getTobacco(this.data.tobaccoId);

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
    const request = this.editTobaccoForm.value as Tobacco;
    // request.countryId = '39c3ea35-f04a-4da2-92d2-eaabb2d90241';
    // request.image?.name = `brand: ${request.name}`;
    // request.image.name = `tobacco: ${request.name}`;

    this.tobaccoService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initEditTobaccoForm(): void {
    this.editTobaccoForm = this.formBuilder.group({
      // image: this.formBuilder.group({
      //   base64: this.tobacco.image.base64,
      // }),
      name: [this.tobacco.name, [Validators.required]],
      description: this.tobacco.description,
      brandId: this.brandControl,
      line: this.lineControl
    });
  };

  private getTobacco(id: string): void {
    this.tobaccoService.getById(id).pipe(
        tap(response => {
          this.tobacco = response;
          this.brandControl.setValue(response.brandId);
          this.lineControl.setValue(response.lineId);
          this.initEditTobaccoForm();
        }))
      .subscribe();
  }
}
