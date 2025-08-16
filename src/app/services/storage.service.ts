import { Injectable, signal, effect } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { StudySession, StudySchedule, ReviewItem } from '../models/study-session.model';
import { StudyItem, ReviewSession } from '../models/spaced-repetition.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    USER_PROFILE: 'gentle_learning_user_profile',
    STUDY_SESSIONS: 'gentle_learning_study_sessions',
    STUDY_SCHEDULE: 'gentle_learning_study_schedule',
    STUDY_ITEMS: 'gentle_learning_study_items',
    REVIEW_SESSIONS: 'gentle_learning_review_sessions',
    REVIEW_QUEUE: 'gentle_learning_review_queue',
    SETTINGS: 'gentle_learning_settings'
  };

  // Signals for reactive state management
  userProfile = signal<UserProfile | null>(null);
  studySessions = signal<StudySession[]>([]);
  studySchedule = signal<StudySchedule | null>(null);
  studyItems = signal<StudyItem[]>([]);
  reviewSessions = signal<ReviewSession[]>([]);
  reviewQueue = signal<ReviewItem[]>([]);

  constructor() {
    this.loadAllData();
    
    // Auto-save when signals change
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.saveToLocalStorage(this.STORAGE_KEYS.USER_PROFILE, profile);
      }
    });

    effect(() => {
      const sessions = this.studySessions();
      this.saveToLocalStorage(this.STORAGE_KEYS.STUDY_SESSIONS, sessions);
    });

    effect(() => {
      const schedule = this.studySchedule();
      if (schedule) {
        this.saveToLocalStorage(this.STORAGE_KEYS.STUDY_SCHEDULE, schedule);
      }
    });

    effect(() => {
      const items = this.studyItems();
      this.saveToLocalStorage(this.STORAGE_KEYS.STUDY_ITEMS, items);
    });

    effect(() => {
      const reviews = this.reviewSessions();
      this.saveToLocalStorage(this.STORAGE_KEYS.REVIEW_SESSIONS, reviews);
    });

    effect(() => {
      const queue = this.reviewQueue();
      this.saveToLocalStorage(this.STORAGE_KEYS.REVIEW_QUEUE, queue);
    });
  }

  private loadAllData(): void {
    const profile = this.loadFromLocalStorage<UserProfile>(this.STORAGE_KEYS.USER_PROFILE);
    if (profile) {
      this.userProfile.set(profile);
    }

    const sessions = this.loadFromLocalStorage<StudySession[]>(this.STORAGE_KEYS.STUDY_SESSIONS);
    if (sessions) {
      this.studySessions.set(sessions);
    }

    const schedule = this.loadFromLocalStorage<StudySchedule>(this.STORAGE_KEYS.STUDY_SCHEDULE);
    if (schedule) {
      this.studySchedule.set(schedule);
    }

    const items = this.loadFromLocalStorage<StudyItem[]>(this.STORAGE_KEYS.STUDY_ITEMS);
    if (items) {
      this.studyItems.set(items);
    }

    const reviews = this.loadFromLocalStorage<ReviewSession[]>(this.STORAGE_KEYS.REVIEW_SESSIONS);
    if (reviews) {
      this.reviewSessions.set(reviews);
    }

    const queue = this.loadFromLocalStorage<ReviewItem[]>(this.STORAGE_KEYS.REVIEW_QUEUE);
    if (queue) {
      this.reviewQueue.set(queue);
    }
  }

  private saveToLocalStorage(key: string, data: any): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  }

  private loadFromLocalStorage<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error loading from localStorage for key ${key}:`, error);
      return null;
    }
  }

  // User Profile methods
  saveUserProfile(profile: UserProfile): void {
    this.userProfile.set(profile);
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    const current = this.userProfile();
    if (current) {
      this.userProfile.set({
        ...current,
        ...updates,
        updatedAt: new Date()
      });
    }
  }

  // Study Session methods
  addStudySession(session: StudySession): void {
    this.studySessions.update(sessions => [...sessions, session]);
  }

  updateStudySession(sessionId: string, updates: Partial<StudySession>): void {
    this.studySessions.update(sessions =>
      sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s)
    );
  }

  getActiveSession(): StudySession | undefined {
    return this.studySessions().find(s => s.status === 'in-progress');
  }

  // Study Items methods
  addStudyItem(item: StudyItem): void {
    this.studyItems.update(items => [...items, item]);
  }

  updateStudyItem(itemId: string, updates: Partial<StudyItem>): void {
    this.studyItems.update(items =>
      items.map(i => i.id === itemId ? { ...i, ...updates } : i)
    );
  }

  getItemsDueForReview(userId: string): StudyItem[] {
    const now = new Date();
    return this.studyItems().filter(
      item => item.userId === userId && new Date(item.nextReview) <= now
    );
  }

  // Schedule methods
  saveStudySchedule(schedule: StudySchedule): void {
    this.studySchedule.set(schedule);
  }

  // Review Session methods
  addReviewSession(review: ReviewSession): void {
    this.reviewSessions.update(reviews => [...reviews, review]);
  }

  // Review Queue methods (SM-2 Spaced Repetition)
  addToReviewQueue(item: ReviewItem): void {
    this.reviewQueue.update(queue => {
      // Remove existing item for same session if any
      const filtered = queue.filter(q => q.sessionId !== item.sessionId);
      return [...filtered, item];
    });
  }

  getReviewsDue(userId?: string): ReviewItem[] {
    const now = new Date();
    return this.reviewQueue().filter(item => 
      new Date(item.nextReview) <= now &&
      (!userId || this.studySessions().find(s => s.id === item.sessionId)?.userId === userId)
    );
  }

  updateReviewItem(sessionId: string, updates: Partial<ReviewItem>): void {
    this.reviewQueue.update(queue =>
      queue.map(item => item.sessionId === sessionId ? { ...item, ...updates } : item)
    );
  }

  removeFromReviewQueue(sessionId: string): void {
    this.reviewQueue.update(queue => 
      queue.filter(item => item.sessionId !== sessionId)
    );
  }

  // Statistics methods
  getStudyStatistics(userId: string, days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentSessions = this.studySessions().filter(
      s => s.userId === userId && new Date(s.startTime) >= cutoffDate && s.status === 'completed'
    );

    const totalMinutes = recentSessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    const averageFocus = recentSessions.reduce((sum, s) => sum + s.performance.focusScore, 0) / (recentSessions.length || 1);
    const completionRate = recentSessions.reduce((sum, s) => sum + s.performance.completionRate, 0) / (recentSessions.length || 1);

    return {
      totalSessions: recentSessions.length,
      totalMinutes: Math.round(totalMinutes * 100) / 100,
      averageFocus: Math.round(averageFocus * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      sessionsPerDay: Math.round((recentSessions.length / days) * 100) / 100
    };
  }

  // Clear all data
  clearAllData(): void {
    if (typeof localStorage !== 'undefined') {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    this.userProfile.set(null);
    this.studySessions.set([]);
    this.studySchedule.set(null);
    this.studyItems.set([]);
    this.reviewSessions.set([]);
  }
}