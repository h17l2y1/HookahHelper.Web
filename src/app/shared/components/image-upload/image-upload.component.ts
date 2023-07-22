import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent {
  @Input() currentImage?: string;
  @Output() newItemEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  public selectFiles(event: any): void {
    this.currentImage = '';
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.newItemEvent.emit(e.target.result);
      this.currentImage = e.target.result;
    };
  }

}
