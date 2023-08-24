import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.css']
})
export class TagEditorComponent {
  public editTagForm: FormGroup = this.initEditTagForm();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tag: Tag },
    public dialogRef: MatDialogRef<TagEditorComponent>,
    private formBuilder: FormBuilder,
    private tagService: TagService,
  ) {}

  public onSave(): void {
    const request: Tag = this.editTagForm.value;
    this.tagService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public initEditTagForm(): FormGroup {
    return this.formBuilder.group({
      id: this.data.tag.id,
      name: [this.data.tag.name, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
