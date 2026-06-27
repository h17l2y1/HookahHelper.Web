import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TagService} from "../tag.service";
import {Tag} from "../../interfaces/entity/tag";
import {NamePipe} from "../../shared/pipes/name.pipe";
import {TagType} from "../../interfaces/enums/tag-type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.scss']
})
export class TagCreateComponent {
  public toggle: boolean = false;
  public color: string = '#595959';
  public nameControl: FormControl = this.formBuilder.control('Tag', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  public createTagForm: FormGroup = this.initCreateTagForm();

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private namePipe: NamePipe,
    private router: Router,
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
      if (oneMore) {
        this.createTagForm.reset({
          name: 'Tag',
          isGlobal: false,
          color: '#595959',
        });
        this.color = '#595959';
        return;
      }
      void this.router.navigate(['/tags']);
    });
  }

  public onCancel(): void {
    void this.router.navigate(['/tags']);
  }

  public onChange(): void {
    this.createTagForm.patchValue({
      name: this.namePipe.transform(this.createTagForm.value.name)
    }, {emitEvent: false})
  }

  protected readonly TagType = TagType;
}
