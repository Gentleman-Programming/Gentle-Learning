import { Component, signal, computed, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { StudyOptimizerService } from '../../services/study-optimizer.service';
import { NotificationService } from '../../services/notification.service';
import { StudySession, Break } from '../../models/study-session.model';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class StudySessionComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private optimizerService = inject(StudyOptimizerService);
  private notificationService = inject(NotificationService);

  // Session state
  sessionActive = signal(false);
  sessionPaused = signal(false);
  onBreak = signal(false);
  currentSession = signal<StudySession | null>(null);
  
  // Timers
  sessionTime = signal(0); // seconds
  breakTime = signal(0); // seconds
  microbreakCountdown = signal(0); // seconds
  
  private sessionInterval?: number;
  private breakInterval?: number;
  private microbreakInterval?: number;

  // User profile
  userProfile = computed(() => this.storageService.userProfile());
  studySchedule = computed(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.optimizerService.calculateOptimalStudySchedule(profile);
  });

  // Session form
  sessionForm = this.fb.group({
    subject: ['', Validators.required],
    sessionType: ['study', Validators.required],
    customDuration: [null as number | null]
  });

  // Progress calculations
  sessionProgress = computed(() => {
    const schedule = this.studySchedule();
    if (!schedule || this.sessionTime() === 0) return 0;
    return Math.min(100, (this.sessionTime() / 60 / schedule.sessionLength) * 100);
  });

  breakProgress = computed(() => {
    const schedule = this.studySchedule();
    if (!schedule || this.breakTime() === 0) return 0;
    return Math.min(100, (this.breakTime() / 60 / schedule.breakDuration) * 100);
  });

  // Display time
  displayTime = computed(() => {
    const time = this.onBreak() ? this.breakTime() : this.sessionTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Statistics
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

  ngOnInit(): void {
    // Check for active session
    const activeSession = this.storageService.getActiveSession();
    if (activeSession) {
      this.resumeSession(activeSession);
    }

    // Request notification permission
    this.notificationService.requestPermission();
  }

  ngOnDestroy(): void {
    this.clearAllIntervals();
    if (this.currentSession()) {
      this.pauseSession();
    }
  }

  startSession(): void {
    if (!this.sessionForm.valid || !this.userProfile()) return;

    const formData = this.sessionForm.value;
    const profile = this.userProfile()!;
    const schedule = this.studySchedule()!;

    const session: StudySession = {
      id: this.generateId(),
      userId: profile.id,
      subject: formData.subject!,
      startTime: new Date(),
      plannedDuration: formData.customDuration || schedule.sessionLength,
      breaksTaken: [],
      performance: {
        focusScore: 100,
        completionRate: 0,
        errorsCount: 0,
        selfReportedFatigue: 1
      },
      status: 'in-progress',
      sessionType: formData.sessionType as 'study' | 'review' | 'practice'
    };

    this.currentSession.set(session);
    this.storageService.addStudySession(session);
    
    this.sessionActive.set(true);
    this.sessionPaused.set(false);
    this.onBreak.set(false);
    this.sessionTime.set(0);
    
    this.startSessionTimer();
    this.scheduleMicrobreaks();
    this.scheduleBreakNotification();
  }

  private startSessionTimer(): void {
    this.clearInterval(this.sessionInterval);
    this.sessionInterval = window.setInterval(() => {
      if (!this.sessionPaused() && !this.onBreak()) {
        this.sessionTime.update(time => time + 1);
        
        // Check if session time reached
        const schedule = this.studySchedule();
        if (schedule && this.sessionTime() >= schedule.sessionLength * 60) {
          this.startBreak();
        }
      }
    }, 1000);
  }

  startBreak(): void {
    this.onBreak.set(true);
    this.breakTime.set(0);
    
    const currentSessionData = this.currentSession();
    if (currentSessionData) {
      const breakData: Break = {
        startTime: new Date(),
        type: 'short'
      };
      
      this.storageService.updateStudySession(currentSessionData.id, {
        breaksTaken: [...currentSessionData.breaksTaken, breakData]
      });
    }

    this.clearInterval(this.sessionInterval);
    this.startBreakTimer();
    
    // Schedule resume notification
    const schedule = this.studySchedule();
    if (schedule) {
      this.notificationService.scheduleResumeNotification(schedule.breakDuration);
    }

    this.notificationService.showNotification(
      'Break Time!',
      'Great work! Time to rest and recharge.',
      'break'
    );
  }

  private startBreakTimer(): void {
    this.clearInterval(this.breakInterval);
    this.breakInterval = window.setInterval(() => {
      this.breakTime.update(time => time + 1);
      
      const schedule = this.studySchedule();
      if (schedule && this.breakTime() >= schedule.breakDuration * 60) {
        this.endBreak();
      }
    }, 1000);
  }

  endBreak(): void {
    this.onBreak.set(false);
    this.breakTime.set(0);
    
    const currentSessionData = this.currentSession();
    if (currentSessionData && currentSessionData.breaksTaken.length > 0) {
      const lastBreak = currentSessionData.breaksTaken[currentSessionData.breaksTaken.length - 1];
      lastBreak.endTime = new Date();
      lastBreak.duration = this.breakTime() / 60;
      
      this.storageService.updateStudySession(currentSessionData.id, {
        breaksTaken: currentSessionData.breaksTaken
      });
    }

    this.clearInterval(this.breakInterval);
    this.startSessionTimer();
    this.scheduleMicrobreaks();
    
    this.notificationService.showNotification(
      'Break Over',
      'Ready to continue? Let\'s get back to work!',
      'resume'
    );
  }

  pauseSession(): void {
    this.sessionPaused.set(true);
    if (this.currentSession()) {
      this.storageService.updateStudySession(this.currentSession()!.id, {
        status: 'paused'
      });
    }
  }

  resumeSession(session?: StudySession): void {
    if (session) {
      this.currentSession.set(session);
      this.sessionActive.set(true);
      // Calculate elapsed time
      const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
      this.sessionTime.set(elapsed);
    }
    
    this.sessionPaused.set(false);
    if (this.currentSession()) {
      this.storageService.updateStudySession(this.currentSession()!.id, {
        status: 'in-progress'
      });
    }
    
    this.startSessionTimer();
  }

  endSession(): void {
    const session = this.currentSession();
    if (!session) return;

    const actualDuration = this.sessionTime() / 60;
    const completionRate = Math.min(100, (actualDuration / session.plannedDuration) * 100);

    // Calculate next review interval using SM-2 algorithm
    const quality = this.calculateSessionQuality(session, completionRate);
    const nextInterval = this.optimizerService.calculateNextInterval(
      session.lastInterval || 0,
      session.easeFactor || 2.5,
      quality
    );
    const newEaseFactor = this.optimizerService.updateEaseFactor(
      session.easeFactor || 2.5,
      quality
    );

    // Schedule next review
    const nextReviewDate = this.optimizerService.getOptimalReviewTime(
      new Date(),
      nextInterval
    );

    this.storageService.updateStudySession(session.id, {
      endTime: new Date(),
      actualDuration,
      status: 'completed',
      performance: {
        ...session.performance,
        completionRate
      },
      nextReview: nextReviewDate,
      lastInterval: nextInterval,
      easeFactor: newEaseFactor,
      qualityScore: quality,
      reviewCount: (session.reviewCount || 0) + 1
    });

    // Add to spaced repetition queue
    this.storageService.addToReviewQueue({
      sessionId: session.id,
      subject: session.subject,
      difficulty: this.calculateDifficulty(quality),
      nextReview: nextReviewDate,
      interval: nextInterval,
      easeFactor: newEaseFactor,
      reviewCount: (session.reviewCount || 0) + 1,
      lastReviewed: new Date()
    });

    this.clearAllIntervals();
    this.resetSession();

    // Show completion notification with next review info
    this.notificationService.showNotification(
      'Session Complete!',
      `Next review scheduled for ${nextReviewDate.toLocaleDateString()}`,
      'completion'
    );
  }

  private scheduleMicrobreaks(): void {
    const schedule = this.studySchedule();
    if (!schedule) return;

    this.clearInterval(this.microbreakInterval);
    this.microbreakInterval = window.setInterval(() => {
      if (!this.sessionPaused() && !this.onBreak()) {
        this.notificationService.scheduleMicrobreak(0);
        this.microbreakCountdown.set(40);
        
        const microbreakTimer = window.setInterval(() => {
          this.microbreakCountdown.update(time => time - 1);
          if (this.microbreakCountdown() <= 0) {
            clearInterval(microbreakTimer);
          }
        }, 1000);
      }
    }, schedule.microbreakInterval * 60 * 1000);
  }

  private scheduleBreakNotification(): void {
    const schedule = this.studySchedule();
    if (!schedule) return;
    
    this.notificationService.scheduleBreakNotification(schedule.sessionLength);
  }

  private clearAllIntervals(): void {
    this.clearInterval(this.sessionInterval);
    this.clearInterval(this.breakInterval);
    this.clearInterval(this.microbreakInterval);
  }

  private clearInterval(interval?: number): void {
    if (interval) {
      window.clearInterval(interval);
    }
  }

  private resetSession(): void {
    this.sessionActive.set(false);
    this.sessionPaused.set(false);
    this.onBreak.set(false);
    this.currentSession.set(null);
    this.sessionTime.set(0);
    this.breakTime.set(0);
    this.microbreakCountdown.set(0);
    this.sessionForm.reset({ sessionType: 'study' });
  }

  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateSessionQuality(session: StudySession, completionRate: number): number {
    // Calculate quality score (0-5) based on multiple factors
    let quality = 3; // Start with neutral

    // Factor 1: Completion rate
    if (completionRate >= 90) quality += 1;
    else if (completionRate >= 70) quality += 0.5;
    else if (completionRate < 50) quality -= 1;

    // Factor 2: Self-reported fatigue (inverse relationship)
    const fatigueImpact = (10 - session.performance.selfReportedFatigue) / 10;
    quality += fatigueImpact;

    // Factor 3: Focus score
    if (session.performance.focusScore >= 80) quality += 0.5;
    else if (session.performance.focusScore < 60) quality -= 0.5;

    // Factor 4: Number of breaks taken vs planned
    const expectedBreaks = Math.floor(session.plannedDuration / 60); // One break per hour
    const actualBreaks = session.breaksTaken.length;
    if (actualBreaks <= expectedBreaks) quality += 0.3;
    else quality -= 0.3;

    return Math.max(0, Math.min(5, quality));
  }

  private calculateDifficulty(quality: number): 'easy' | 'medium' | 'hard' {
    if (quality >= 4) return 'easy';
    if (quality >= 2.5) return 'medium';
    return 'hard';
  }

  reportFatigue(level: number): void {
    const session = this.currentSession();
    if (session) {
      this.storageService.updateStudySession(session.id, {
        performance: {
          ...session.performance,
          selfReportedFatigue: level
        }
      });

      // Adaptive response based on fatigue level and current context
      this.handleFatigueResponse(level, session);
    }
  }

  private handleFatigueResponse(fatigueLevel: number, session: StudySession): void {
    const schedule = this.studySchedule();
    if (!schedule) return;

    // Track fatigue pattern for future optimization
    const currentTime = this.sessionTime() / 60; // minutes
    const fatigueData = {
      level: fatigueLevel,
      timeElapsed: currentTime,
      sessionLength: session.plannedDuration,
      timeOfDay: new Date().getHours()
    };

    if (fatigueLevel >= 8) {
      // Critical fatigue - immediate intervention
      if (!this.onBreak()) {
        this.startBreak();
        this.notificationService.showNotification(
          'Critical Fatigue Detected',
          'Starting immediate break to prevent burnout',
          'fatigue'
        );
      }
    } else if (fatigueLevel >= 6) {
      // High fatigue - suggest action
      const trigger = this.notificationService.getAdaptiveTrigger(
        10 - fatigueLevel, // Convert fatigue to motivation (lower motivation)
        3, // Reduced ability due to fatigue
        'during'
      );
      
      this.notificationService.showNotification(
        'High Fatigue Detected',
        trigger.message,
        'fatigue'
      );

      // Suggest micro-break if not already on break
      if (!this.onBreak() && currentTime >= 15) {
        this.notificationService.scheduleMicrobreak(0);
      }
    } else if (fatigueLevel >= 4) {
      // Moderate fatigue - gentle suggestion
      this.notificationService.showNotification(
        'Take Care',
        'Consider a short break or some deep breaths',
        'wellness'
      );
    }

    // Adaptive session optimization
    this.optimizeSessionBasedOnFatigue(fatigueLevel, currentTime);
  }

  private optimizeSessionBasedOnFatigue(fatigueLevel: number, currentTime: number): void {
    const session = this.currentSession();
    const schedule = this.studySchedule();
    if (!session || !schedule) return;

    // If consistently high fatigue, suggest shorter future sessions
    if (fatigueLevel >= 7 && currentTime < session.plannedDuration * 0.5) {
      // User is fatigued less than halfway through - session might be too long
      const userProfile = this.userProfile();
      if (userProfile) {
        // Reduce recommended session length by 15%
        const newRecommendedLength = Math.max(15, session.plannedDuration * 0.85);
        
        this.notificationService.showNotification(
          'Session Optimization',
          `Consider ${Math.round(newRecommendedLength)}-minute sessions for better focus`,
          'optimization'
        );
      }
    }
  }
}