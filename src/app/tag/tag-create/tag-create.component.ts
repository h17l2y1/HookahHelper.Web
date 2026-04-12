import {Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TagComponentComponent } from '../../shared/components/tag-component/tag-component.component';
import { MatButton } from '@angular/material/button';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
    selector: 'app-tag-create',
    templateUrl: './tag-create.component.html',
    styleUrls: ['./tag-create.component.scss'],
    imports: [MatDialogTitle, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSlideToggle, TagComponentComponent, MatButton, ColorPickerModule, MatDialogActions]
})
export class TagCreateComponent {
  public toggle: boolean = false;
  public color: string = '#595959';
  public nameControl: FormControl = this.formBuilder.control('Tag', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  public createTagForm: FormGroup = this.initCreateTagForm();

  constructor(
    public dialogRef: MatDialogRef<TagCreateComponent>,
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private namePipe: NamePipe,
  ) {}

  private initCreateTagForm(): FormGroup {
    return this.formBuilder.group({
      name: this.nameControl,
      isGlobal: false,
      color: this.color
    });
  };

  public onSave(oneMore?: boolean): void {
    if (this.createTagForm.invalid) {
      this.createTagForm.markAllAsTouched();
      return;
    }
    const request: Tag = this.createTagForm.value;
    request.color = this.color;
    this.tagService.create(request).subscribe(() => {
      this.dialogRef.close(oneMore);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onChange(): void {
    this.createTagForm.patchValue({
      name: this.namePipe.transform(this.createTagForm.value.name)
    }, {emitEvent: false})
  }

  protected readonly TagType = TagType;
}
