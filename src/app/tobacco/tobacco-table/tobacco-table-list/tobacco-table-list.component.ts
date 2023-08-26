import {Component, EventEmitter, Input, Output} from '@angular/core';
import {tap} from "rxjs";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";
import {ConfirmationPopupComponent} from "../../../shared/components/confirmation-popup/confirmation-popup.component";
import {Tobacco} from "../../../interfaces/entity/tobacco";

@Component({
  selector: 'app-tobacco-table-list',
  templateUrl: './tobacco-table-list.component.html',
  styleUrls: ['./tobacco-table-list.component.scss']
})
export class TobaccoTableListComponent {
  @Input() isLoadingResults!: boolean;
  @Input() tobaccos!: Tobacco[];
  @Output("getTobaccosEmit") getTobaccos: EventEmitter<any> = new EventEmitter();

  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'tags', 'globalTags', 'action'];

  constructor(
    public dialog: MatDialog,
    private tobaccoService: TobaccoService)
  {}

  public onEdit(id: string): void {
    this.tobaccoService.getById(id).pipe(
      tap(response => {
        const dialogRef = this.dialog.open(TobaccoEditorComponent, {
          data: {
            tobacco: response
          },
          maxWidth: '1000px',
          backdropClass: 'blurred',
          enterAnimationDuration: ENTER_ANIMATION_DURATION,
          exitAnimationDuration: EXIT_ANIMATION_DURATION
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getTobaccos.emit();
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
