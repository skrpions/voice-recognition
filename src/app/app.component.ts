import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AudioService } from './shared/services/audio.service';
import { VoiceRecognitionService } from './shared/services/voice-recognition.service';
declare var annyang: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'voice-recognition';
  text: string = '';

  numbers: number[] = [];
  result: number | null = null;

  constructor(
    private voiceSrv: VoiceRecognitionService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.voiceSrv.text$.subscribe((newText: string) => {
      console.log('New text received:', newText); // Añadir un log para verificar la recepción del texto
      this.text = newText;
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

  sumNumbers(): void {
    this.result = this.numbers.reduce((acc, curr) => acc + curr, 0);
  }
}
