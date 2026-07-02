import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.scss']
})
export class TagCreateComponent {
  public color: string = '#595959';
  public nameControl: FormControl = this.formBuilder.control('Tag', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  public createTagForm: FormGroup = this.initCreateTagForm();
  @Output() public saved = new EventEmitter<void>();
  @Output() public closed = new EventEmitter<void>();

  constructor(
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
    this.createTagForm.patchValue({ color: this.color }, { emitEvent: false });
    this.tagService.create(request).subscribe(() => {
      if (oneMore) {
        this.createTagForm.reset({
          name: 'Tag',
          isGlobal: false,
          color: '#595959',
        });
        this.color = '#595959';
        return;
      }
      this.saved.emit();
    });
  }

  public onCancel(): void {
    this.closed.emit();
  }

  public onChange(): void {
    this.createTagForm.patchValue({
      name: this.namePipe.transform(this.createTagForm.value.name)
    }, {emitEvent: false})
  }

  public onColorChange(color: string): void {
    this.color = color;
    this.createTagForm.patchValue({ color }, { emitEvent: false });
  }

  protected readonly TagType = TagType;
}
