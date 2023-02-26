import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'desktop_pomodoro_timer';

  @ViewChild('timer') timer!: ElementRef;

  private timeLimit: number = 25*1000;
  protected timeLeft: number = this.timeLimit;

  protected isRunning: boolean = false;
  protected isSoundOff: boolean = false;

  private countdown: Subscription = new Subscription();

  private musicFocus: HTMLAudioElement = new Audio();
  protected volumeValue: number = 0.5;

  constructor() { }

  ngOnInit(): void {
    this.initTimer();
    this.changeVolume();
    this.musicFocus.src = "assets/audio/01_lofi_playlist.mp3";
  }

  /**
   * Timer
   */
  private initTimer(): void {
    this.timeLeft = this.timeLimit = 25*1000; // 25 minutes == 1500 seconds == 1500000 milliseconds
  }

  protected startTimerFocus(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.playMusic();

      this.countdown = interval(100)
        .pipe(takeWhile(() => this.timeLeft > 0))
        .subscribe({
          next: () => {
            if (this.timeLeft > 0) {
              this.timeLeft -= 100;

              this.setCircleDasharray();
            }
          },
          complete: () => {
            this.timeLeft = 0;
            this.timeLimit = 5*1000; // 5 minutes == 300 seconds = 300000 milliseconds
            this.isRunning = false;
            this.startTimerBreak();
          }
        });
    }
  }

  protected startTimerBreak(): void {
    if (!this.isRunning) {
      this.isRunning = true;

      this.countdown = interval(100)
        .pipe(takeWhile(() => this.timeLeft < this.timeLimit))
        .subscribe({
          next: () => {
            if (this.timeLeft < this.timeLimit) {
              this.timeLeft += 100;

              this.setCircleDasharray();
            }
          },
          complete: () => {
            this.initTimer();
            this.isRunning = false;
            this.startTimerFocus();
          }
        });
    }
  }

  protected resetTimer(): void {
    this.countdown.unsubscribe();
    this.initTimer();
    this.isRunning = false;
    this.timer.nativeElement.setAttribute("stroke-dasharray", "283");
    this.musicFocus.load();
  }

  protected pauseTimer(): void {
    this.countdown.unsubscribe();
    this.isRunning = false;
    this.musicFocus.pause();
  }

  /**
   * Circle animation
   */
  protected calculateTimeFraction(): number {
    const rawTimeFraction = this.timeLeft / this.timeLimit;
    return rawTimeFraction;
  }

  protected setCircleDasharray(): void {
    const circleDasharray = `${(
      (this.calculateTimeFraction() * 283) >= 0 ? (this.calculateTimeFraction() * 283) : 0 // 283 is the circumference of the circle
    ).toFixed(0)} 283`;

    this.timer.nativeElement.setAttribute("stroke-dasharray", circleDasharray);
  }

  /**
   * Music player
   */
  private playMusic(): void{
    this.musicFocus.play();
  }

  protected changeVolume(): void {
    this.musicFocus.volume = this.volumeValue;
  }

  protected toggleVolume(): void {
    this.musicFocus.muted = this.isSoundOff = !this.musicFocus.muted;
  }

}
