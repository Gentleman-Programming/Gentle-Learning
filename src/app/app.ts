import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('Gentle Learning');
  private storageService = inject(StorageService);
  
  userProfile = computed(() => this.storageService.userProfile());
  hasCompletedAssessment = computed(() => !!this.userProfile()?.assessmentCompleted);
}
