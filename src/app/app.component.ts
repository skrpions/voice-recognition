import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AudioService } from './shared/services/audio.service';
import { VoiceRecognitionService } from './shared/services/voice-recognition.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'voice-recognition-numbers';
  number: string = '';
  sum: number | null = null;
  reactiveForm: FormGroup;
  arrayNumbers: string[] = [];

  constructor(
    private voiceSrv: VoiceRecognitionService,
    private audioService: AudioService,
    private fb: FormBuilder
  ) {
    this.reactiveForm = this.fb.group({
      number1: [''],
      number2: [''],
      number3: [''],
    });
  }
  ngOnInit() {
    this.voiceSrv.number$.subscribe((number: string) => {
      console.log('New number received:', number);
      this.number = number;
      const numberReceived = number.trim().split(' ').filter(Boolean); // Filtra valores vacíos
      this.updateInputValues(numberReceived);
    });

    this.voiceSrv.sum$.subscribe((newSum: number) => {
      console.log('New sum received:', newSum);
      this.sum = newSum;

      // Resetear formulario después de calcular la suma
      this.reactiveForm.reset();
    });
  }

  private updateInputValues(number: string[]): void {
    if (number[0]) {
      this.arrayNumbers.push(number[0]);
      console.log('✅ Number Received: ', number);
      console.log('✅ Array Numbers: ', this.arrayNumbers);
      for (let i = 0; i < 3; i++) {
        const controlName = `number${i + 1}`;
        const value = this.arrayNumbers[i] || ''; // Usa un valor vacío si no hay suficientes números
        console.log(`Setting ${controlName} to ${value}`); // Añade esta línea para depuración
        this.reactiveForm.get(controlName)?.setValue(value);
      }
    }
  }

  startVoiceRecognition(): void {
    this.voiceSrv.start();
  }

  stopVoiceRecognition(): void {
    this.voiceSrv.stop();
  }

  async checkMicPermission() {
    try {
      await this.audioService.getMicrophonePermission();
      alert('Permiso otorgado para acceder al micrófono.');
    } catch (error) {
      alert(`Error al solicitar permiso para el micrófono: ${error}`);
    }
  }
}
