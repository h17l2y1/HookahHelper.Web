import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {Observable, tap} from "rxjs";
import {Brand} from "../../../interfaces/entity/brand";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {TobaccoList} from "../tobacco-table-list/TobaccoList";
import {TobaccoViewComponent} from "../../tobacco-view/tobacco-view.component";

@Component({
  selector: 'app-tobacco-table-card',
  templateUrl: './tobacco-table-card.component.html',
  styleUrls: ['./tobacco-table-card.component.scss']
})
export class TobaccoTableCardComponent {
  @Input() brands$!: Observable<Brand[]>;
  @Input() tobaccos!: TobaccoList[];
  @Output("getTobaccosEmit") getTobaccos: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService
  ) {}

  public onView(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoViewComponent, {
          data: {
            tobacco: response
          },
          // width: '300',
          // height: '300',
          // maxWidth: '1200px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result){
            this.getTobaccos.emit();
          }
        });
      }))
      .subscribe();
  }
}
