import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TobaccoService} from "../tobacco/tobacco.service";
import {BrandService} from "../brand/brand.service";
import {filter, switchMap, tap} from "rxjs";
import {Brand} from "../interfaces/entity/brand";
import {Tobacco} from "../interfaces/entity/tobacco";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {TopMixService} from "../top-mix/top-mix.service";
import {TobaccoMix} from "../interfaces/entity/tobacco-mix";
import {Mix} from "../interfaces/entity/mix";
import {ChartValue} from "./chart-value";

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent implements OnInit {
  public brandControl: FormControl = this.formBuilder.control('');
  public allBrandsOption!: Brand[];
  public tobaccos: Tobacco[] = [];
  public selectedTobaccos: Tobacco[] = [];
  public constructorForm!: FormGroup;
  private tempId: number = 0;
  public chartData: ChartValue[] = [];

  constructor(
    private brandService: BrandService,
    private tobaccoService: TobaccoService,
    private formBuilder: FormBuilder,
    private mixService: TopMixService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.constructorForm = this.initFormArray()

    this.constructorForm.valueChanges.pipe(
      tap((data: Mix) => {
        const total = data.tobaccoMixes.reduce((n, {percent}) => n + +percent, 0);
        if (total > 100) {
          this.getTobaccoMix.controls.forEach(control => {
            control?.setErrors({'total percentage over 100': true});
            control.markAsTouched();
            this.changeDetectorRef.markForCheck();
          })
        }
        this.updateChart();
      })
    ).subscribe()

    this.brandService.getOptions().pipe(
      tap(brands => {
        this.allBrandsOption = brands;
      })
    ).subscribe();

    this.brandControl.valueChanges.pipe(
      filter(Boolean),
      switchMap((brandId) => this.tobaccoService.getByBrandId(brandId)),
      tap(response => this.tobaccos = response)
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
    this.setAvgPercentToControls();
    this.updateChart();
  }

  public drop(event: CdkDragDrop<Tobacco[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const value: Tobacco = event.container.data[event.currentIndex];
      this.addTobaccoMix(value);
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
    this.setAvgPercentToControls();
  }

  public onReset(): void {
    const tobaccoMixes: TobaccoMix[] = this.getTobaccoMix.value;
    tobaccoMixes.forEach(tobaccoMix => {
      const tobacco = {
        id: tobaccoMix.tobaccoId,
        name: tobaccoMix.tobaccoName,
        brandId: tobaccoMix.brandId,
        image: {
          link: tobaccoMix.imageLink
        },
      } as Tobacco

      this.tobaccos.push(tobacco);
    })

    this.tobaccos.sort((a, b) => (a.name < b.name ? -1 : 1));
    this.chartData = [];
    this.getTobaccoMix.clear();
  }

  private setAvgPercentToControls(): void {
    const count = this.getTobaccoMix.value.length;
    let res : number = 100 / count;
    res = Math.round(res);
    this.getTobaccoMix.controls.forEach(control => {
      control.patchValue({percent: res}, {emitEvent: false});
    })
  }

  private updateChart(): void {
    const tobaccoMixes: TobaccoMix[] = this.getTobaccoMix.value;
    this.chartData = tobaccoMixes.map(x => <ChartValue> {
      name: x.tobaccoName,
      value: x.percent
    });
  }

  public onSave(): void {
    if (this.constructorForm.invalid) {
      this.constructorForm.markAllAsTouched();
      return;
    }

    this.mixService.create(this.constructorForm.value).pipe(
      tap(() => this.onReset())
    ).subscribe()
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  private initFormArray(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      tobaccoMixes: this.formBuilder.array([], this.MyCustomValidator),
    })
  }

  public MyCustomValidator(): null {
    // const data = control.value as TobaccoMix[];
    // const total = data?.reduce((n, {percent}) => n + +percent, 0);
    // if (total > 100){
    //   control.setErrors({'total percentage over 100': true});
    // }
    return  null;
  }

}
