import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  getMicrophonePermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject(new Error('Browser does not support media devices.'));
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }
}
