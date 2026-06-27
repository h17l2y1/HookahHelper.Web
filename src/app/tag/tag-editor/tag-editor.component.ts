import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent implements OnInit {
  public toggle: boolean = false;
  public color: string = '#595959';
  public nameControl: FormControl = this.formBuilder.control('', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  public editTagForm: FormGroup = this.initEditTagForm();
  private tagId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private namePipe: NamePipe,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.tagId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tagService.getById(this.tagId).subscribe((tag) => {
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
    this.tagService.update(request).subscribe(() => {
      void this.router.navigate(['/tags']);
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
    void this.router.navigate(['/tags']);
  }

  public onChange(): void {
    this.editTagForm.patchValue({
      name: this.namePipe.transform(this.editTagForm.value.name)
    }, {emitEvent: false})
  }

  protected readonly TagType = TagType;
}
