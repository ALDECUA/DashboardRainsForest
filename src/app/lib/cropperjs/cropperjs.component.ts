import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropperjs',
  templateUrl: './cropperjs.component.html',
  styleUrls: ['./cropperjs.component.scss']
})
export class CropperjsComponent implements OnInit {

  @Output() onDefineImage = new EventEmitter<any>();

  @Input() loading: boolean = false;

  title = 'ngImageCrop';

  ngOnInit() {
    
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent );
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
  }
  loadImageFailed() {
    /* show message */
  }

  public defineImage() {
    this.onDefineImage.emit(this.croppedImage);
  }
}
