import { Injectable, signal } from '@angular/core';

export interface NotificationTrigger {
  type: 'spark' | 'facilitator' | 'signal';
  message: string;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NOTIFICATION_PERMISSION_KEY = 'gentle_learning_notification_permission';
  
  notificationsEnabled = signal(false);
  permission = signal<NotificationPermission>('default');

  constructor() {
    this.checkNotificationSupport();
    this.loadPermissionState();
  }

  private checkNotificationSupport(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }
    return true;
  }

  private loadPermissionState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    const savedPermission = localStorage.getItem(this.NOTIFICATION_PERMISSION_KEY);
    if (savedPermission) {
      this.permission.set(savedPermission as NotificationPermission);
      this.notificationsEnabled.set(savedPermission === 'granted');
    }
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission.set(Notification.permission);
      this.notificationsEnabled.set(Notification.permission === 'granted');
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.checkNotificationSupport()) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission.set(permission);
      this.notificationsEnabled.set(permission === 'granted');
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.NOTIFICATION_PERMISSION_KEY, permission);
      }
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async scheduleBreakNotification(minutes: number): Promise<void> {
    if (!this.notificationsEnabled()) {
      return;
    }

    const milliseconds = minutes * 60 * 1000;
    
    setTimeout(() => {
      this.showNotification(
        'Time for a Break!',
        'Your study session is complete. Take a break to maintain optimal performance.',
        'break'
      );
    }, milliseconds);
  }

  async scheduleResumeNotification(minutes: number): Promise<void> {
    if (!this.notificationsEnabled()) {
      return;
    }

    const milliseconds = minutes * 60 * 1000;
    
    setTimeout(() => {
      this.showNotification(
        'Ready to Resume?',
        'Your break is over. Time to get back to studying!',
        'resume'
      );
    }, milliseconds);
  }

  async scheduleMicrobreak(minutes: number): Promise<void> {
    if (!this.notificationsEnabled()) {
      return;
    }

    const milliseconds = minutes * 60 * 1000;
    
    setTimeout(() => {
      this.showNotification(
        'Microbreak Time',
        'Take 40 seconds to look away from the screen or view nature.',
        'microbreak'
      );
    }, milliseconds);
  }

  showNotification(title: string, body: string, tag: string): void {
    if (!this.notificationsEnabled()) {
      return;
    }

    const options: NotificationOptions = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag,
      requireInteraction: false,
      silent: false,
    };

    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds if not interacted with
    setTimeout(() => notification.close(), 10000);
  }

  private getNotificationActions(tag: string): Array<{ action: string; title: string }> {
    switch (tag) {
      case 'break':
        return [
          { action: 'start-break', title: 'Start Break' },
          { action: 'snooze-5', title: 'Snooze 5 min' }
        ];
      case 'resume':
        return [
          { action: 'resume', title: 'Resume Study' },
          { action: 'extend-break', title: 'Extend Break' }
        ];
      case 'microbreak':
        return [
          { action: 'done', title: 'Done' }
        ];
      default:
        return [];
    }
  }

  // JITAI (Just-in-Time Adaptive Intervention) implementation
  getAdaptiveTrigger(
    motivationLevel: number,
    abilityLevel: number,
    context: 'start' | 'during' | 'break'
  ): NotificationTrigger {
    // Based on BJ Fogg's Behavior Model (B=MAT)
    
    if (motivationLevel < 3 && abilityLevel < 3) {
      // Low motivation, low ability - Need spark
      return {
        type: 'spark',
        message: this.getSparkMessage(context),
        action: 'Start with just 5 minutes'
      };
    } else if (motivationLevel >= 3 && abilityLevel < 3) {
      // High motivation, low ability - Need facilitator
      return {
        type: 'facilitator',
        message: this.getFacilitatorMessage(context),
        action: 'Your materials are ready'
      };
    } else {
      // High ability - Just need signal
      return {
        type: 'signal',
        message: this.getSignalMessage(context),
        action: 'Study time'
      };
    }
  }

  private getSparkMessage(context: string): string {
    const messages: Record<string, string> = {
      'start': 'Every expert was once a beginner. Start small and build momentum!',
      'during': 'You\'re making progress! Each minute counts toward your goal.',
      'break': 'Great work! You\'ve earned this break. Recharge and come back stronger.'
    };
    return messages[context] || 'Keep going!';
  }

  private getFacilitatorMessage(context: string): string {
    const messages: Record<string, string> = {
      'start': 'Everything is set up for you. Just open your materials and begin.',
      'during': 'Focus on one concept at a time. You\'ve got this!',
      'break': 'Step away from your desk. A short walk will refresh your mind.'
    };
    return messages[context] || 'You can do this!';
  }

  private getSignalMessage(context: string): string {
    const messages: Record<string, string> = {
      'start': 'Time to study: Your scheduled session begins now.',
      'during': 'Halfway through! Maintain your focus.',
      'break': 'Break time: Step away for optimal recovery.'
    };
    return messages[context] || 'Continue your session.';
  }

  // Optimal notification timing based on research
  getOptimalNotificationTimes(chronotype: 'morning' | 'evening' | 'intermediate'): number[] {
    // Returns array of minutes from midnight for optimal notification times
    switch (chronotype) {
      case 'morning':
        return [360, 480, 600, 840]; // 6am, 8am, 10am, 2pm
      case 'evening':
        return [600, 780, 1020, 1320]; // 10am, 1pm, 5pm, 10pm
      default:
        return [480, 660, 900, 1200]; // 8am, 11am, 3pm, 8pm
    }
  }
}