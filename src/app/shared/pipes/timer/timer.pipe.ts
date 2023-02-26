import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let valueInSeconds = Math.floor(value / 1000);
    let minutes: number = Math.floor(valueInSeconds / 60);
    let seconds: number = valueInSeconds % 60;

    return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  }

}
