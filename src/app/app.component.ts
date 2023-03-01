import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription, takeWhile } from 'rxjs';
import { ElectronService } from './shared/services/electron.service';
import { TimerSettingsComponent } from './timer-settings/timer-settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'desktop_pomodoro_timer';

  @ViewChild('timer') timer!: ElementRef;

  private timeLimit: number = 0;
  protected timeLeft: number = this.timeLimit;
  private timeFocus: number = 1500*1000; // 25 minutes == 1500 seconds == 1500000 milliseconds
  private timeBreak: number = 300*1000; // 5 minutes == 300 seconds = 300000 milliseconds

  protected isRunning: boolean = false;
  protected isSoundOff: boolean = false;

  private countdown: Subscription = new Subscription();

  private musicFocus: HTMLAudioElement = new Audio();
  private musicBreak: HTMLAudioElement = new Audio();
  protected volumeValue: number = 0.5;
  private playlist: string[] = [];

  constructor(
    private electronService: ElectronService,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.playlist = await this.electronService.getAllAudioFiles();
    this.initTimer();
    this.changeVolume();
    this.nextSong();

    this.musicFocus.addEventListener('ended', () => {
      this.nextSong();
      this.musicFocus.play();
    });
  }

  protected openTimerSettings(): void {
    this.resetTimer();

    const dialogRef = this.dialog.open(TimerSettingsComponent, {
      width: '50%',
      data: {
        timeFocus: this.timeFocus
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        this.timeFocus = result.timeFocus;
        this.timeBreak = result.timeBreak;
        this.initTimer();
      }
    });
  }

  /**
   * Timer
   */
  private initTimer(): void {
    this.timeLeft = this.timeLimit = this.timeFocus;
  }

  protected startTimerFocus(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.musicBreak.pause();
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
            this.timeLimit = this.timeBreak;
            this.isRunning = false;
            this.startTimerBreak();
          }
        });
    }
  }

  protected startTimerBreak(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.musicFocus.pause();
      this.launchBreakMusic();

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
    this.nextSong();
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
    this.musicBreak.volume = this.volumeValue;
  }

  protected toggleVolume(): void {
    this.musicFocus.muted = this.isSoundOff = !this.musicFocus.muted;
    this.musicBreak.muted = this.isSoundOff;
  }

  private nextSong(): void {
    const currentSongIndex = this.playlist.indexOf(this.musicFocus.src);
    let nextSongIndex = Math.floor(Math.random() * this.playlist.length);

    while (nextSongIndex === currentSongIndex) {
      nextSongIndex = Math.floor(Math.random() * this.playlist.length);
    }

    this.musicFocus.src = "assets/audio/lofi-hip-hop/" + this.playlist[nextSongIndex];
  }

  private launchBreakMusic(): void {
    this.musicBreak.src = "assets/audio/break/bedside-clock-alarm-95792.mp3";
    this.musicBreak.load();
    this.musicBreak.play();
  }

}
