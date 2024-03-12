import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import {ImageFile} from "./ImageFile";
import {DomSanitizer} from "@angular/platform-browser";

@Directive({
  selector: '[corpImgUpload]',
})
export class ImageUploaderDirective {
  // @Output() dropFiles: EventEmitter<ImageFile[]> = new EventEmitter();
  @HostBinding('style.background') backgroundColor = DropColor.Default;
  @Output() dropFiles: EventEmitter<ImageFile[]> = new EventEmitter<ImageFile[]>();

  constructor(private sanitizer: DomSanitizer) {
  }

  @HostListener('dragover', ['$event']) public dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener('hover', ['$event']) public hover(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener('dragleave', ['$event']) public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;
  }

  @HostListener('drop', ['$event']) public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;

    let fileList = event.dataTransfer?.files;
    let files: ImageFile[] = [];
    if (fileList){
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        // const url = window.URL.createObjectURL(file);
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        files.push({ file, url });
      }
    }
    if (files.length > 0) {
      this.dropFiles.emit(files);
    }
  }
}

enum DropColor {
  Default = '#C6E4F1', // Default color
  Over = '#ACADAD', // Color to be used once the file is "over" the drop box
}
