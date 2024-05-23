import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecognition = false;
  number = '';
  tempWords: string | null = null;

  private numberSubject = new Subject<string>();
  number$ = this.numberSubject.asObservable();

  constructor() {
    this.init();
  }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';
    this.recognition.maxAlternatives = 1; // Configura el número máximo de alternativas

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');

      // Filtrar solo números incluyendo puntos decimales
      const numberMatch = transcript.match(/\d+(\.\d+)?/g);
      if (numberMatch) {
        this.tempWords = numberMatch.join(' ');
        console.log('Recognized numbers:', this.tempWords);
      } else {
        this.tempWords = null; // Reset tempWords if no number is found
        console.log(transcript);
      }
    });

    this.recognition.addEventListener('end', () => {
      if (!this.isStoppedSpeechRecognition) {
        this.wordConcat();
        this.recognition.start();
      }
    });

    // Manejo de errores
    this.recognition.addEventListener('error', (event: any) => {
      console.error('Error de reconocimiento de voz:', event.error);
    });
  }

  start() {
    this.isStoppedSpeechRecognition = false;
    this.recognition.start();
    console.log('Speech recognition started');
  }

  stop() {
    this.isStoppedSpeechRecognition = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('Speech recognition stopped');
  }

  private wordConcat() {
    if (this.tempWords !== null) {
      this.number += this.tempWords + ' ';
      this.tempWords = null;
    }

    // Emitir el nuevo valor de number
    this.numberSubject.next(this.number); // Emitir el nuevo valor de number
  }
}
