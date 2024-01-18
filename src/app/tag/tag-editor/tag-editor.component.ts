import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent {
  public editTagForm: FormGroup = this.initEditTagForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tag: Tag },
    public dialogRef: MatDialogRef<TagEditorComponent>,
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private namePipe: NamePipe,
  ) {
  }

  public onSave(): void {
    const request: Tag = this.editTagForm.value;
    this.tagService.update(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public initEditTagForm(): FormGroup {
    return this.formBuilder.group({
      id: this.data.tag.id,
      name: [this.data.tag.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      isGlobal: this.data.tag.isGlobal
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onChange(): void {
    this.editTagForm.patchValue({
      name: this.namePipe.transform(this.editTagForm.value.name)
    }, {emitEvent: false})
  }
}
