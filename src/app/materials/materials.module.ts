import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

export const MODULES = [
  BrowserAnimationsModule,
  MatInputModule,
  MatFormFieldModule
];

@NgModule({
  imports: [
    CommonModule,
    MODULES
  ],
  exports: [
    MODULES
  ],
  declarations: []
})
export class MaterialsModule { }
