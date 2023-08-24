import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent {

  public createTagForm: FormGroup = this.initCreateTagForm();

  constructor(
    public dialogRef: MatDialogRef<TagCreateComponent>,
    private formBuilder: FormBuilder,
    private tagService: TagService,
  ) {}

  private initCreateTagForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
    });
  };

  public onSave(oneMore?: boolean): void {
    if (this.createTagForm.invalid) {
      this.createTagForm.markAllAsTouched();
      return;
    }
    const request: Tag = this.createTagForm.value;
    this.tagService.create(request).subscribe(() => {
      this.dialogRef.close(oneMore);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
