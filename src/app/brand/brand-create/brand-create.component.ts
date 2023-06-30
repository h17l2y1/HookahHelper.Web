import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../interfaces/entity/brand";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CreateBrand} from "../../interfaces/other/create-brand";
import {Line} from "../../interfaces/entity/line";
import {NewLine} from "../../interfaces/other/new-line";

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.scss']
})
export class BrandCreateComponent implements OnInit {
  public createBrandForm: FormGroup = this.initCreateTobaccoForm();
  private tempId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    public dialogRef: MatDialogRef<BrandCreateComponent>,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    console.log('open BrandCreateComponent')
  }

  onSave(): void {
    const request = this.createBrandForm.value as CreateBrand;
    // request.lines = request.lines.map(x => ({_id: x.id, name: x.name}));

    // this.brandService.createWithDependencies(request).subscribe(() => {
    //   this.notificationService.success(`${request.name} created`);
    //   this.dialogRef.close();
    // });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateTobaccoForm(): FormGroup {
    return this.formBuilder.group({
      imageBase64: '',
      name: '',
      lines: this.formBuilder.array([
        this.formBuilder.group({
          tempId: this.formBuilder.control(this.getNextId()),
          name: this.formBuilder.control('')
        })
      ]),
      madeIn: '',
      description: '',
    });
  };

  public onNoClick(): void {
    this.dialogRef.close();
  }

  private getNextId(): number {
    return ++this.tempId;
  }

  public onRemove(tempId: number) {
    this.getLines.removeAt(tempId);
  }

  public setImage(imageBase64: string | ArrayBuffer) {
    this.createBrandForm.patchValue({imageBase64: imageBase64});
  }

  get getLines(): FormArray {
    return this.createBrandForm.get('lines') as FormArray;
  }

  public addLine(): void {
    this.getLines.push(
      this.formBuilder.group({
        tempId: this.formBuilder.control(this.getNextId()),
        name: this.formBuilder.control('')
      })
    );
  }
}
