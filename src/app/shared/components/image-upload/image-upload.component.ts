import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ImageCroppedEvent} from "ngx-image-cropper";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit {
  public imageControlLink!: FormControl;
  public imageControlBase64!: FormControl;
  public imageChangedEvent!: any;
  public croppedImage!: SafeUrl;
  public fileAttr = 'Choose File';
  public isFileExist = false;

  constructor(private rootFormGroup: FormGroupDirective, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.imageControlLink = this.rootFormGroup.control.get('image.link') as FormControl;
    this.imageControlBase64 = this.rootFormGroup.control.get('image.base64') as FormControl;
    if (this.imageControlLink.value){
      this.isFileExist = true;
      this.fileChangeEvent(this.imageControlLink.value, true);
    }
  }

  public fileChangeEvent(event: any, isNew?: boolean): void {
    this.isFileExist = !!isNew;
    this.imageChangedEvent = event;
  }

  public async imageCropped(event: ImageCroppedEvent): Promise<void> {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl as string);
    const base64 = await this.convertBlobToBase64(event.blob);
    this.imageControlBase64.setValue(base64);
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
