import {Component, OnInit} from '@angular/core';
import {TobaccoService} from "../tobacco/tobacco.service";
import {BrandService} from "../brand/brand.service";
import {Observable, switchMap, tap} from "rxjs";
import {Brand} from "../interfaces/entity/brand";
import {Tobacco} from "../interfaces/entity/tobacco";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {FormBuilder, FormControl} from "@angular/forms";
import {GetAllResponse} from "../interfaces/models/get-all-response";

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent implements OnInit {

  public brands$: Observable<Brand[]> = this.brandService.getOptions();
  // public tobaccos$: Observable<Tobacco[]> = this.tobaccoService.getOptions();
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  public brandControl: FormControl = this.formBuilder.control('');


  constructor(
    private tobaccoService: TobaccoService,
    private brandService: BrandService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.brandControl.valueChanges.pipe(
      // switchMap((brandId) => this.tobaccoService.getTobaccosWithBrand()),
    ).subscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }



}
