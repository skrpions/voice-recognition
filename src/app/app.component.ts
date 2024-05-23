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
  numberForm: FormGroup;

  constructor(
    private voiceSrv: VoiceRecognitionService,
    private audioService: AudioService,
    private fb: FormBuilder
  ) {
    this.numberForm = this.fb.group({
      number1: [''],
      number2: [''],
      number3: [''],
    });
  }

  ngOnInit() {
    this.voiceSrv.number$.subscribe((number: string) => {
      console.log('New number received:', number);
      this.number = number;
      const numberArray = number.trim().split(' ');

      let inputIndex = 0;

      numberArray.forEach((num) => {
        if (inputIndex < 3) {
          const controlName = `number${inputIndex + 1}`;
          this.numberForm.controls[controlName].setValue(num);
          inputIndex++;
        }
      });
    });

    this.voiceSrv.sum$.subscribe((newSum: number) => {
      console.log('New sum received:', newSum);
      this.sum = newSum;

      // Resetear formulario después de calcular la suma
      this.numberForm.reset();
    });
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
