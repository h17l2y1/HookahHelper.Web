import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit {
  public control!: FormControl;

  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.control = this.rootFormGroup.control.get('image.base64') as FormControl;
  }

  public selectFiles(event: any): void {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.control?.setValue(e.target.result);
    };
  }



}
