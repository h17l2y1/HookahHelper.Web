import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../brand.service";
import {Observable, tap} from "rxjs";
import {CountryService} from "../../services/country.service";
import {Country} from "../../interfaces/entity/country";

@Component({
  selector: 'app-brand-editor',
  templateUrl: './brand-editor.component.html',
  styleUrls: ['./brand-editor.component.scss']
})
export class BrandEditorComponent implements OnInit {
  public updateBrandForm!: FormGroup;
  private tempId: number = 0;
  public countyControl: FormControl = this.formBuilder.control('', [Validators.required]);
  public brand$: Observable<Brand> = this.brandService.getById(this.data.id).pipe(
    tap(response => {
      this.countyControl.setValue(response.country.id)
      this.updateBrandForm = this.initBrandUpdateForm(response);
    })
  );
  public countries$: Observable<Country[]> = this.countryService.getOptions();
  private brandId!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<BrandEditorComponent>,
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private brandService: BrandService) {
  }

  ngOnInit(): void {
    this.brand$.subscribe();
  }

  public onSave(): void {
    const request: CreateBrand = this.updateBrandForm.value;
    request.image.name = `brand: ${request.name};`
    request.lines = request.lines ? request.lines : undefined;
    this.brandService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initBrandUpdateForm(brand: Brand): FormGroup {
    this.brandId = brand.id;
    return this.formBuilder.group({
      id: brand.id,
      image: this.formBuilder.group({
        id: brand.image.id,
        name: brand.image.name,
        link: brand.image.link,
        base64: null,
      }),
      name: [brand.name, [Validators.required]],
      description: brand.description,
      countryId: this.countyControl,
      lines: brand.lines ? this.setLines(brand.lines) : [],
    });
  };

  private setLines(lines: Line[]): FormArray {
    const arr: FormGroup[] = lines.map(line => {
      return this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        id: this.formBuilder.control(line.id),
        brandId: this.formBuilder.control(this.brandId),
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
    return this.updateBrandForm.get('lines') as FormArray;
  }

  public addLine(): void {
    this.getLines.push(
      this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        brandId: this.formBuilder.control(this.brandId),
        name: this.formBuilder.control(''),
        isNew: true,
      })
    );
  }
}
