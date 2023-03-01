import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-timer-settings',
  templateUrl: './timer-settings.component.html',
  styleUrls: ['./timer-settings.component.scss']
})
export class TimerSettingsComponent implements OnInit {
  protected timeFocus: number = this.data.timeFocus;
  protected timeBreak: number = this.computeTimeBreak();

  protected customTimer: FormGroup = new FormGroup({
    minutes: new FormControl(0, []),
    seconds: new FormControl(0, [])
  });

  constructor(
    public dialogRef: MatDialogRef<TimerSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {timeFocus: number}
  ) { }

  ngOnInit(): void {
    this.pathForm();
    this.handleFormChanges();
  }

  private handleFormChanges(): void {
    this.customTimer.valueChanges.subscribe(val => {
      this.timeFocus = this.convertToMilliseconds();
      this.timeBreak = this.computeTimeBreak();
    });
  }

  private convertToMilliseconds(): number {
    const minutes = this.customTimer.get('minutes')?.value;
    const seconds = this.customTimer.get('seconds')?.value;

    return (minutes * 60000) + (seconds * 1000);
  }

  private computeTimeBreak(): number {
    return this.timeFocus * 0.2;
  }

  private pathForm(): void {
    const minutes = Math.floor(this.data.timeFocus / 60000);
    const seconds = ((this.data.timeFocus % 60000) / 1000).toFixed(0);

    this.customTimer.patchValue({
      minutes: minutes,
      seconds: seconds
    });
  }

  protected setCustomTime(): void {
    this.dialogRef.close({
      timeFocus: this.timeFocus,
      timeBreak: this.timeBreak
    });
  }

  protected closeModale(): void {
    this.dialogRef.close();
  }

}
