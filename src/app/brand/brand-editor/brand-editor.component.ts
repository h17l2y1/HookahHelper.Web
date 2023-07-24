import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../brand.service";
import {tap} from "rxjs";
import {CountryService} from "../../services/country.service";

@Component({
  selector: 'app-brand-editor',
  templateUrl: './brand-editor.component.html',
  styleUrls: ['./brand-editor.component.scss']
})
export class BrandEditorComponent implements OnInit {
  public brandForm!: FormGroup;
  private tempId: number = 0;
  public countyControl = this.formBuilder.control('', [Validators.required]);
  public brand$ = this.brandService.getById(this.data.id);
  public countries$ = this.countryService.getOptions();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<BrandEditorComponent>,
    private formBuilder: FormBuilder,
    private readonly countryService: CountryService,
    private readonly brandService: BrandService) {
  }

  ngOnInit(): void {
    this.getUpdateData();
  }

  private getUpdateData(): void {
    this.brand$.pipe(
      tap(response => {
        this.brandForm = this.initBrandUpdateForm(response);
      })
    ).subscribe()
  }

  public onSave(): void {
    const request: CreateBrand = this.brandForm.value;
    request.image.name = `brand: ${request.name}`;

    if (request.lines?.length) {
      request.lines = undefined
    }

    this.brandService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initBrandUpdateForm(brand: Brand): FormGroup {
    this.countyControl.setValue(brand.country.id);

    return this.formBuilder.group({
      id: brand.id,
      image: this.formBuilder.group({
        id: brand.image?.id,
        name: brand.image?.name,
        base64: brand.image?.base64,
      }),
      name: [brand.name, [Validators.required]],
      description: brand.description,
      countryId: this.countyControl,
      lines: brand.lines ? this.setLines(brand.lines) : [],
    });
  };

  private setLines(lines: Line[]): FormArray {
    const arr = lines.map(line => {
      return this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        id: this.formBuilder.control(line.id),
        name: this.formBuilder.control(line.name)
      })
    })

    return this.formBuilder.array(arr);
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  public onRemove(tempId: number): void {
    this.getLines.removeAt(tempId);
  }

  get getLines(): FormArray {
    return this.brandForm.get('lines') as FormArray;
  }

  public addLine(): void {
    this.getLines.push(
      this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        name: this.formBuilder.control('')
      })
    );
  }
}
