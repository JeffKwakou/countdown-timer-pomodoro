import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { TimerPipe } from './pipes/timer/timer.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TimerPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    TimerPipe,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
