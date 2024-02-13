import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent {
  public toggle: boolean = false;
  public color: string = this.data.tag.color;
  public nameControl: FormControl = this.formBuilder.control(this.data.tag.name, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
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
      name: this.nameControl,
      isGlobal: this.data.tag.isGlobal,
      color: this.color
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

    protected readonly TagType = TagType;
}
