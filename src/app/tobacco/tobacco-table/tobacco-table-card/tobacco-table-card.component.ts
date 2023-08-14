import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoCreateComponent} from "../../tobacco-create/tobacco-create.component";
import {TobaccoService} from "../../tobacco.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {GetAllResponse} from "../../../interfaces/models/get-all-response";
import {ActivatedRoute} from "@angular/router";
import {BrandService} from "../../../brand/brand.service";
import {CountryService} from "../../../services/country.service";
import {filter, Observable, switchMap, tap} from "rxjs";
import {Filter} from "../../../interfaces/models/filter";
import {Brand} from "../../../interfaces/entity/brand";
import {Country} from "../../../interfaces/entity/country";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Line} from "../../../interfaces/entity/line";
import {LineService} from "../../../services/line.service";
import {HeavinessService} from "../../../services/heaviness.service";
import {Heaviness} from "../../../interfaces/entity/heaviness";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";

@Component({
  selector: 'app-tobacco-table-card',
  templateUrl: './tobacco-table-card.component.html',
  styleUrls: ['./tobacco-table-card.component.scss']
})
export class TobaccoTableCardComponent {
  @Input() brands$!: Observable<Brand[]>;
  @Input() tobaccos!: Tobacco[];

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService
  ) {}

  public onEdit(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoEditorComponent, {
          data: {
            tobacco: response,
            // brands$: this.brands$,
            // heaviness: this.heavinessOption
          },
          maxWidth: '1000px',
          // height: '70%',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result){
            // this.getTobaccos();
          }
        });
      }))
      .subscribe();
  }
}
