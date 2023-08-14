import {Component, Input} from '@angular/core';
import {Tobacco} from "../../../interfaces/entity/tobacco";
import {tap} from "rxjs";
import {TobaccoEditorComponent} from "../../tobacco-editor/tobacco-editor.component";
import {ENTER_ANIMATION_DURATION, EXIT_ANIMATION_DURATION} from "../../../constants";
import {MatDialog} from "@angular/material/dialog";
import {TobaccoService} from "../../tobacco.service";

@Component({
  selector: 'app-tobacco-table-list',
  templateUrl: './tobacco-table-list.component.html',
  styleUrls: ['./tobacco-table-list.component.scss']
})
export class TobaccoTableListComponent {
  @Input() tobaccos!: Tobacco[];
  public isLoadingResults = true;
  public readonly displayedColumns: string[] = ['image', 'name', 'description', 'action'];

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

}
