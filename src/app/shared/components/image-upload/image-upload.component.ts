import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {tap} from "rxjs";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit {
  public imageControl!: FormControl;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileAttr = 'Choose File';
  public isFileChoose = false;

  constructor(private rootFormGroup: FormGroupDirective, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.imageControl = this.rootFormGroup.control.get('image.base64') as FormControl;
  }

  fileChangeEvent(event: any): void {
    this.isFileChoose = true;
    this.imageChangedEvent = event;
  }

  async imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl as string);
    const base64 = await this.convertBlobToBase64(event.blob);
    this.imageControl?.setValue(base64);
  }

  private convertBlobToBase64 = (blob: any) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
