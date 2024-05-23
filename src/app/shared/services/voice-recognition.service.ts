import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
declare var webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecognition = false;
  text = '';
  tempWords: any;

  private textSubject = new Subject<string>();
  text$ = this.textSubject.asObservable(); // Observable que se puede suscribir en el componente

  constructor() {
    this.init();
  }

  init() {
    // this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';
    //this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');

      this.tempWords = transcript;
      console.log(transcript);
    });

    this.recognition.addEventListener('end', () => {
      if (!this.isStoppedSpeechRecognition) {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  start() {
    this.isStoppedSpeechRecognition = false;
    this.recognition.start();
    console.log('Speech recognition started');

    /* this.recognition.addEventListener('end', (condition: any) => {
      if (!this.isStoppedSpeechRecognition) {
        this.recognition.stop();
        console.log('End Speech Recognition');
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    }); */
  }

  stop() {
    this.isStoppedSpeechRecognition = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('Speech recognition stopped');
  }

  wordConcat() {
    //this.text += this.tempWords;
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';

    // Emitir el nuevo valor de text
    this.textSubject.next(this.text); // Emitir el nuevo valor de text
  }
}
