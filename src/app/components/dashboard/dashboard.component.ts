import { Component, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { StudyOptimizerService } from '../../services/study-optimizer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class DashboardComponent implements OnInit {
  private storageService = inject(StorageService);
  private optimizerService = inject(StudyOptimizerService);
  private router = inject(Router);

  userProfile = computed(() => this.storageService.userProfile());
  todayStats = computed(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.storageService.getStudyStatistics(profile.id, 1);
  });
  
  weekStats = computed(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.storageService.getStudyStatistics(profile.id, 7);
  });

  monthStats = computed(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.storageService.getStudyStatistics(profile.id, 30);
  });

  upcomingReviews = computed(() => {
    const profile = this.userProfile();
    if (!profile) return [];
    return this.storageService.getItemsDueForReview(profile.id).slice(0, 5);
  });

  recentSessions = computed(() => {
    const profile = this.userProfile();
    if (!profile) return [];
    return this.storageService.studySessions()
      .filter(s => s.userId === profile.id)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);
  });

  studySchedule = computed(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.optimizerService.calculateOptimalStudySchedule(profile);
  });

  ngOnInit(): void {
    const profile = this.userProfile();
    if (!profile || !profile.assessmentCompleted) {
      this.router.navigate(['/assessment']);
    }
  }

  getChronotypeIcon(chronotype?: string): string {
    switch (chronotype) {
      case 'morning': return '🌅';
      case 'evening': return '🌙';
      default: return '☀️';
    }
  }

  getChronotypeLabel(chronotype?: string): string {
    switch (chronotype) {
      case 'morning': return 'Morning Person';
      case 'evening': return 'Night Owl';
      default: return 'Intermediate';
    }
  }

  formatMinutes(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return d.toLocaleDateString();
    }
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}