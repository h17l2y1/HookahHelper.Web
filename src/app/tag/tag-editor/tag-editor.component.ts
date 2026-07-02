import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent implements OnChanges {
  public color: string = '#595959';
  public nameControl: FormControl = this.formBuilder.control('', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  public editTagForm: FormGroup = this.initEditTagForm();
  public isLoading = false;
  @Input() public tagId = '';
  @Output() public saved = new EventEmitter<void>();
  @Output() public closed = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private namePipe: NamePipe,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tagId'] && this.tagId) {
      this.loadTag();
    }
  }

  private loadTag(): void {
    this.isLoading = true;
    this.tagService.getById(this.tagId).subscribe((tag) => {
      this.isLoading = false;
      this.color = tag.color;
      this.nameControl.setValue(tag.name);
      this.editTagForm.patchValue({
        id: tag.id,
        name: tag.name,
        isGlobal: tag.isGlobal,
        color: tag.color,
      }, {emitEvent: false});
    });
  }

  public onSave(): void {
    const request: Tag = this.editTagForm.value;
    request.color = this.color;
    this.editTagForm.patchValue({ color: this.color }, { emitEvent: false });
    this.tagService.update(request).subscribe(() => {
      this.saved.emit();
    });
  }

  public initEditTagForm(): FormGroup {
    return this.formBuilder.group({
      id: null,
      name: this.nameControl,
      isGlobal: false,
      color: this.color
    });
  }

  public onCancel(): void {
    this.closed.emit();
  }

  public onChange(): void {
    this.editTagForm.patchValue({
      name: this.namePipe.transform(this.editTagForm.value.name)
    }, {emitEvent: false})
  }

  public onColorChange(color: string): void {
    this.color = color;
    this.editTagForm.patchValue({ color }, { emitEvent: false });
  }

  protected readonly TagType = TagType;
}
