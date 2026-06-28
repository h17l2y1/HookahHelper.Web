import {Component, OnInit} from '@angular/core';
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Line} from "../../interfaces/entity/line";
import {BrandService} from "../brand.service";
import {Observable, tap} from "rxjs";
import {CountryService} from "../../services/country.service";
import {Country} from "../../interfaces/entity/country";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {ImageType} from "../../interfaces/enums/image-type";
import {ActivatedRoute, Router} from "@angular/router";

interface UpdateBrandRequest {
  id: number;
  image: {
    id: number;
    name: string;
    link: string;
    base64: string | null;
    type: ImageType;
  };
  name: string;
  description?: string | null;
  countryId: string;
  lines?: Array<{
    id?: string | null;
    brandId: string;
    name: string;
    isNew: boolean;
  }>;
}

@Component({
  selector: 'app-brand-editor',
  templateUrl: './brand-editor.component.html',
  styleUrls: ['./brand-editor.component.scss']
})
export class BrandEditorComponent implements OnInit {
  public readonly aspectRatio: number = 127/51;
  public brand!: Brand;
  public updateBrandForm!: FormGroup;
  private tempId: number = 0;
  public countyControl: FormControl = this.formBuilder.control('', [Validators.required]);
  public brand$: Observable<Brand> = new Observable<Brand>();
  public countries$: Observable<Country[]> = this.countryService.getOptions();
  private brandId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    private brandService: BrandService,
    private namePipe: NamePipe,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/brands']);
      return;
    }

    this.brand$ = this.brandService.getById(id).pipe(
      tap(response => {
        this.brand = response;
        this.countyControl.setValue(String(response.country.id));
        this.updateBrandForm = this.initBrandUpdateForm(response);
      })
    );
    this.brand$.subscribe();
  }

  public onSave(): void {
    const request = this.buildRequest();
    request.image.name = `brand: ${request.name};`;
    this.brandService.update(request).subscribe(() => {
      this.router.navigate(['/brands']);
    });
  }

  public onCancel(): void {
    this.router.navigate(['/brands']);
  }

  public get countryIdControl(): FormControl {
    return this.updateBrandForm.get('countryId') as FormControl;
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
        type: ImageType.Brand,
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
        id: this.formBuilder.control(String(line.id)),
        brandId: this.formBuilder.control(String(this.brandId)),
        name: this.formBuilder.control(line.name),
        isNew: this.formBuilder.control(false)
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
        id: this.formBuilder.control(null),
        brandId: this.formBuilder.control(String(this.brandId)),
        name: this.formBuilder.control(''),
        isNew: true,
      })
    );
  }

  public onChange(): void {
    this.updateBrandForm.patchValue({
      name: this.namePipe.transform(this.updateBrandForm.value.name)
    }, {emitEvent: false})
  }

  private buildRequest(): UpdateBrandRequest {
    const raw = this.updateBrandForm.getRawValue();
    return {
      id: Number(raw.id),
      image: {
        id: Number(raw.image.id),
        name: raw.image.name,
        link: raw.image.link,
        base64: raw.image.base64,
        type: raw.image.type,
      },
      name: raw.name,
      description: raw.description,
      countryId: String(raw.countryId),
      lines: raw.lines?.map((line: { id?: string | null; brandId: string; name: string; isNew?: boolean }) => ({
        id: line.id ? String(line.id) : null,
        brandId: String(line.brandId ?? this.brandId),
        name: line.name,
        isNew: Boolean(line.isNew),
      })),
    };
  }
}
