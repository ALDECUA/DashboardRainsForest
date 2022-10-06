import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperjsComponent } from './cropperjs.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    CropperjsComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule
  ],
  exports: [CropperjsComponent]
})
export class CropperjsModule { }
