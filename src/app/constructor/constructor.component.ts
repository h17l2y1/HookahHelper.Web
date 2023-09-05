import {Component, OnInit} from '@angular/core';
import {TobaccoService} from "../tobacco/tobacco.service";
import {BrandService} from "../brand/brand.service";
import {filter, switchMap, tap} from "rxjs";
import {Brand} from "../interfaces/entity/brand";
import {Tobacco} from "../interfaces/entity/tobacco";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {TopMixService} from "../top-mix/top-mix.service";
import {TobaccoMix} from "../interfaces/entity/tobacco-mix";
import {Mix} from "../interfaces/entity/mix";
import {escapeLabel, formatLabel} from "@swimlane/ngx-charts";
import {ChartValue} from "./chart-value";

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent implements OnInit {
  public brandControl: FormControl = this.formBuilder.control('');
  public brandAutocompleteControl: FormControl = this.formBuilder.control('');
  public filteredBrandsOptions!: Brand[];
  public allBrandsOption!: Brand[];
  public tobaccos: Tobacco[] = [];
  public selectedTobaccos: Tobacco[] = [];
  public constructorForm!: FormGroup;
  private tempId: number = 0;

  // public chartData: ChartValue[] = [];
  public chartData: ChartValue[] = [
    // { name: "Mobiles", value: 10 },
    // { name: "Laptop", value: 20 },
    // { name: "AC", value: 20 },
    // { name: "AC1", value: 50 },
  ];

  constructor(
    private brandService: BrandService,
    private tobaccoService: TobaccoService,
    private formBuilder: FormBuilder,
    private mixService: TopMixService) {
  }

  ngOnInit(): void {
    this.constructorForm = this.initFormArray()

    this.constructorForm.valueChanges.pipe(
      tap((data: Mix) => {
        const total = data.tobaccoMixes.reduce((n, {percent}) => n + +percent, 0);
        console.log(total)
        if (total > 100) {
          console.log('> 100')
        }
        this.updateChart();
      })
    ).subscribe()

    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
        this.filteredBrandsOptions = brands;
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      filter(Boolean),
      switchMap((brandId) => this.tobaccoService.getByBrandId(brandId)),
      tap(response => this.tobaccos = response)
    ).subscribe();

    this.brandAutocompleteControl.valueChanges.pipe(
      tap((value: string | Brand) => {
        if (typeof value === 'string') {
          this.filteredBrandsOptions = this._filter(value);
          return;
        }
        this.brandControl.setValue(value?.id)
        this.filteredBrandsOptions = value?.name ? this._filter(value.name) : this.allBrandsOption.slice();
      }),
    ).subscribe();
  }

  get getTobaccoMix(): FormArray {
    return this.constructorForm.get('tobaccoMixes') as FormArray;
  }

  public addTobaccoMix(value: Tobacco): void {
    this.getTobaccoMix.push(
      this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        imageLink: value.image.link,
        tobaccoName: value.name,
        tobaccoId: value.id,
        brandId: value.brandId,
        percent: [0, [Validators.min(1), Validators.max(99)]]
      })
    );
  }

  public displayFn(brand: { name: string }): string {
    return brand && brand.name ? brand.name : '';
  }

  public drop(event: CdkDragDrop<Tobacco[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const value: Tobacco = event.container.data[event.currentIndex];
      this.addTobaccoMix(value);
      // this.updateChart();
      // this.chartData.push({name: "asd", value: 10})
      // this.chartData = this.chartData.concat([{name: "asd", value: 10}])
    }
  }

  public onRemove(tobaccoMix: TobaccoMix, tempId: number): void {
    if (tobaccoMix.brandId === this.brandControl.value) {
      const tobacco = {
        id: tobaccoMix.tobaccoId,
        name: tobaccoMix.tobaccoName,
        brandId: tobaccoMix.brandId,
        image: {
          link: tobaccoMix.imageLink
        },
      } as unknown as Tobacco;
      this.tobaccos.push(tobacco);
      this.tobaccos.sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    this.getTobaccoMix.removeAt(tempId);
    // this.updateChart();
  }

  private updateChart(): void {
    const xxx: TobaccoMix[] = this.getTobaccoMix.value;

    // const mapped = xxx.map(x =><ChartValue> {
    //   name: x.tobaccoName,
    //   value: x.percent
    // })

    // this.chartData = this.chartData.concat(asd);
    // const arr = [{name: "asd", value: 10}, {name: "asd1", value: 10}]
    this.chartData = xxx.map(x =><ChartValue> {
      name: x.tobaccoName,
      value: x.percent
    })
  }

  public onSave(): void {
    if (this.constructorForm.invalid) {
      this.constructorForm.markAllAsTouched();
      return;
    }

    this.mixService.create(this.constructorForm.value).pipe(

    ).subscribe()
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  private _filter(name: string): Brand[] {
    const filterValue = name.toLowerCase();
    return this.allBrandsOption.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private initFormArray(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      tobaccoMixes: this.formBuilder.array([], this.MyCustomValidator),
    })
  }

  public MyCustomValidator(control: AbstractControl): null {
    const data = control.value as TobaccoMix[];
    const total = data?.reduce((n, {percent}) => n + +percent, 0);
    if (total > 100){
      control.setErrors({'total percentage over 100': true});
    }
    return  null;
  }

}
