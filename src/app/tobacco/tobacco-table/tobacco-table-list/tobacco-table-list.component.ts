import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {Observable, tap} from "rxjs";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {Heaviness} from "../../../interfaces/entity/heaviness";
import {Tag} from "../../../interfaces/entity/tag";
import {Brand} from "../../../interfaces/entity/brand";
import {Country} from "../../../interfaces/entity/country";
import {TagService} from "../../../services/tag.service";
import {BrandService} from "../../../brand/brand.service";
import {HeavinessService} from "../../../services/heaviness.service";

@Component({
  selector: 'app-tobacco-table-list',
  templateUrl: './tobacco-table-list.component.html',
  styleUrls: ['./tobacco-table-list.component.scss']
})
export class TobaccoTableListComponent {
  @Input() tobaccos!: Tobacco[];
  // @Input() heavinessOption!: Heaviness[];
  // @Input() brandsOption!: Brand[];
  // @Input() tagOption!: Tag[];
  @Output("getTobaccosEmit") getTobaccos: EventEmitter<any> = new EventEmitter();

  public isLoadingResults = true;
  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'action'];

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService,
    // private tagService: TagService,
    // private brandService: BrandService,
    // private heavinessService: HeavinessService,
  ) {}

  public onEdit(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoEditorComponent, {
          data: {
            tobacco: response,
            // brand: this.brandsOption.find(brand => brand.id === response.brandId),
            // tags: this.tagOption,
            // heaviness: this.heavinessOption
          },
          maxWidth: '1000px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.getTobaccos();
          }
        });
      }))
      .subscribe();
  }

  public onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(popupResponse => {
      if (popupResponse) {
        this.tobaccoService.remove(id).pipe(
          tap(() => this.getTobaccos.emit())
        ).subscribe();
      }
    });
  }

}
