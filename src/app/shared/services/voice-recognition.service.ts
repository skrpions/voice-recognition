import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  private recognition = new webkitSpeechRecognition();
  private isStoppedSpeechRecognition = false;
  private recognizedNumbers: number[] = [];
  private currentInterimTranscript: string = '';

  private numberSubject = new Subject<string>();
  private sumSubject = new Subject<number>();

  number$ = this.numberSubject.asObservable();
  sum$ = this.sumSubject.asObservable();

  constructor() {
    this.init();
  }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      console.log('Interim Transcript:', interimTranscript);
      console.log('Final Transcript:', finalTranscript);

      if (
        finalTranscript.toLowerCase().includes('guardar') ||
        finalTranscript.toLowerCase().includes('save')
      ) {
        this.calculateSum();
      } else {
        this.processTranscript(finalTranscript);
        // Emitimos el número final reconocido
        this.numberSubject.next(finalTranscript.trim());
      }

      this.currentInterimTranscript = interimTranscript;
    });

    this.recognition.addEventListener('end', () => {
      if (!this.isStoppedSpeechRecognition) {
        this.recognition.start();
      }
    });

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
    this.recognition.stop();
    console.log('Speech recognition stopped');
  }

  private processTranscript(transcript: string) {
    const numberMatch = transcript.match(/\d+(\.\d{0,1})?/g);
    if (numberMatch) {
      const newNumbers = numberMatch.map((num) => parseFloat(num));
      this.recognizedNumbers.push(...newNumbers);
      console.log('Recognized numbers:', this.recognizedNumbers);

      // Ejecutar la función de guardar automáticamente si se han registrado 3 números
      if (this.recognizedNumbers.length % 3 === 0) {
        this.calculateSum();
      }
    }
  }

  private calculateSum() {
    if (this.recognizedNumbers.length >= 3) {
      const lastThreeNumbers = this.recognizedNumbers.slice(-3);
      const sum = lastThreeNumbers.reduce((acc, curr) => acc + curr, 0);
      console.log('Sum of last three numbers:', sum);
      this.sumSubject.next(sum);

      // Reseteamos el índice de entrada después de guardar la suma
      this.recognizedNumbers = [];
    }
  }
}
