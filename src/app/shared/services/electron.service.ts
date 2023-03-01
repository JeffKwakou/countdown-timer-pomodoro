import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  constructor() { }

  public async getAllAudioFiles(): Promise<string[]> {
    return await (window as any).electronApi.getAudioFiles();
  }
}
