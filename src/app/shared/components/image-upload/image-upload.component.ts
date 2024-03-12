import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroupDirective} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit {
  @Input() aspectRatio!: number;
  @Output() fileName: EventEmitter<string> = new EventEmitter<string>();
  private readonly imageTypes = ['.png', '.jpg', '.jpeg', '.webp'];
  public scale = 1;
  public isFileExist = false;
  public isFileLoaded = false;
  public croppedImage!: SafeUrl;
  public file!: File;
  public imageControlLink!: FormControl;
  public imageControlBase64!: FormControl;
  public imageChangedEvent!: any;


  constructor(private rootFormGroup: FormGroupDirective, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.imageControlLink = this.rootFormGroup.control.get('image.link') as FormControl;
    this.imageControlBase64 = this.rootFormGroup.control.get('image.base64') as FormControl;
    if (this.imageControlLink.value) {
      this.isFileExist = true;
      this.fileChangeEvent(this.imageControlLink.value, true);
    }
  }

  public fileChangeEvent(event: any, isNew?: boolean): void {
    this.isFileLoaded = true;
    this.isFileExist = !!isNew;
    this.imageChangedEvent = event;
  }

  public async imageCropped(event: ImageCroppedEvent): Promise<void> {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl as string);
    const base64 = await this.convertBlobToBase64(event.blob);
    this.imageControlBase64.setValue(base64);
  }

  private convertBlobToBase64 = (blob: any) => new Promise((resolve, reject): void => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public onFileDropped($event: any): void {
    this.file = $event[0];
    this.isFileLoaded = true;
    const name = this.file.name.replace(new RegExp(this.imageTypes.join("|")), "");
    this.fileName.emit(name);
  }

}
