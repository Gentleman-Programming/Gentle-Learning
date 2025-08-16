import { Injectable, signal, computed } from '@angular/core';
import { UserProfile, ChronoType } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class StudyOptimizerService {
  private readonly ULTRADIAN_CYCLE = 90; // minutes
  private readonly POMODORO_DEFAULT = 25; // minutes
  private readonly OPTIMAL_52_17_RATIO = { work: 52, break: 17 };

  calculateOptimalStudySchedule(profile: UserProfile) {
    const baseParams = this.calculateBaseParameters(profile);
    const chronotypeAdjustment = this.getChronotypeAdjustment(profile);
    const sessionParams = this.calculateSessionParameters(baseParams, profile);

    return {
      sessionLength: sessionParams.sessionLength,
      breakDuration: sessionParams.breakDuration,
      optimalStartTime: chronotypeAdjustment.optimalStartTime,
      peakPerformanceWindows: chronotypeAdjustment.peakWindows,
      maxDailyStudyTime: this.calculateMaxDailyStudyTime(profile),
      maxConcepts: sessionParams.maxConcepts,
      microbreakInterval: 15, // minutes - prevents goal habituation
      microbreakDuration: 40, // seconds - evidence-based attention restoration
      breakActivities: this.getOptimalBreakActivities(sessionParams.breakDuration),
    };
  }

  private calculateBaseParameters(profile: UserProfile) {
    const age = profile.age;
    let attentionSpan: number;
    let workingMemoryCapacity: number;

    if (age < 18) {
      // Children and teenagers
      attentionSpan = Math.min(age * 3, 45);
      workingMemoryCapacity = 2 + (age - 7) * 0.2;
    } else if (age <= 25) {
      // Young adults
      attentionSpan = 50;
      workingMemoryCapacity = 4;
    } else if (age <= 60) {
      // Adults
      attentionSpan = 52; // Based on DeskTime study
      workingMemoryCapacity = 4;
    } else {
      // Older adults
      attentionSpan = 40;
      workingMemoryCapacity = 3.5;
    }

    // Adjust for sustained attention test results if available
    if (profile.sustainedAttentionSpan) {
      attentionSpan = (attentionSpan + profile.sustainedAttentionSpan / 60) / 2;
    }

    if (profile.workingMemoryCapacity) {
      workingMemoryCapacity = profile.workingMemoryCapacity;
    }

    return { attentionSpan, workingMemoryCapacity };
  }

  private calculateSessionParameters(baseParams: any, profile: UserProfile) {
    let sessionLength: number;
    let breakDuration: number;

    // Apply DeskTime 52/17 ratio for adult learners (evidence-based)
    if (profile.age >= 18 && profile.age <= 60) {
      sessionLength = this.OPTIMAL_52_17_RATIO.work;
      breakDuration = this.OPTIMAL_52_17_RATIO.break;
      
      // Adjust for intensive study
      if (profile.studyIntensity === 'intensive') {
        breakDuration = Math.min(breakDuration, sessionLength * 0.15);
      }
    } else if (profile.studyIntensity === 'intensive') {
      // For intensive study (exams, deadlines)
      sessionLength = Math.min(baseParams.attentionSpan, 45);
      breakDuration = sessionLength * 0.15;
    } else {
      // For casual study (long-term learning) - younger/older learners
      sessionLength = Math.min(baseParams.attentionSpan, this.ULTRADIAN_CYCLE * 0.8);
      breakDuration = sessionLength * 0.22;
    }

    // Cognitive Load Theory: Limit to 4±1 concepts per session
    const maxConcepts = Math.min(
      Math.floor(baseParams.workingMemoryCapacity * 0.8),
      profile.age < 18 ? 3 : 4 // Age-adjusted cognitive load
    );

    return { sessionLength, breakDuration, maxConcepts };
  }

  private getChronotypeAdjustment(profile: UserProfile) {
    const chronotypeScore = profile.chronotypeScore || 3;
    const chronotypeShift = (chronotypeScore - 3) * 60; // minutes from baseline
    
    let optimalStartTime = 600 + chronotypeShift; // 10 AM baseline
    let peakWindows: Array<{ start: number; end: number }> = [];

    switch (profile.chronotype) {
      case 'morning':
        peakWindows = [
          { start: 480, end: 720 }, // 8 AM - 12 PM
          { start: 840, end: 960 }  // 2 PM - 4 PM
        ];
        break;
      case 'evening':
        peakWindows = [
          { start: 660, end: 780 },   // 11 AM - 1 PM
          { start: 1020, end: 1260 }  // 5 PM - 9 PM
        ];
        break;
      default: // intermediate
        peakWindows = [
          { start: 600, end: 780 },  // 10 AM - 1 PM
          { start: 900, end: 1020 }  // 3 PM - 5 PM
        ];
    }

    return { optimalStartTime, peakWindows };
  }

  private calculateMaxDailyStudyTime(profile: UserProfile): number {
    if (profile.age < 15) {
      return 120; // 2 hours
    } else if (profile.age < 18) {
      return 180; // 3 hours
    } else if (profile.studyIntensity === 'intensive') {
      return 360; // 6 hours for intensive study
    } else {
      return 240; // 4 hours for regular adult learning
    }
  }

  // SM-2 Algorithm implementation
  calculateNextInterval(currentInterval: number, easeFactor: number, quality: number): number {
    if (quality >= 3) {
      if (currentInterval === 0) {
        return 1;
      } else if (currentInterval === 1) {
        return 6;
      } else {
        return Math.round(currentInterval * easeFactor);
      }
    } else {
      return 1;
    }
  }

  updateEaseFactor(easeFactor: number, quality: number): number {
    const newEase = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(1.3, newEase);
  }

  // Calculate optimal review time based on ultradian rhythms
  getOptimalReviewTime(lastStudyTime: Date, interval: number): Date {
    const nextReview = new Date(lastStudyTime);
    nextReview.setDate(nextReview.getDate() + interval);
    
    // Adjust to optimal time of day (morning for most people)
    nextReview.setHours(10, 0, 0, 0);
    
    return nextReview;
  }

  // Attention span assessment
  assessAttentionSpan(responseTimes: number[], errors: number[]): number {
    // Calculate sustained attention span based on SART methodology
    let consecutiveGoodResponses = 0;
    let maxSpan = 0;
    const meanRT = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const stdRT = Math.sqrt(
      responseTimes.reduce((sq, n) => sq + Math.pow(n - meanRT, 2), 0) / responseTimes.length
    );

    for (let i = 0; i < responseTimes.length; i++) {
      if (errors[i] === 0 && Math.abs(responseTimes[i] - meanRT) <= stdRT) {
        consecutiveGoodResponses++;
        maxSpan = Math.max(maxSpan, consecutiveGoodResponses);
      } else {
        consecutiveGoodResponses = 0;
      }
    }

    return maxSpan * 3; // Convert to seconds (assuming 3-second trials)
  }

  // Evidence-based break activities for attention restoration
  getOptimalBreakActivities(breakDuration: number): Array<{
    activity: string;
    duration: number;
    benefit: string;
    type: 'nature' | 'movement' | 'rest' | 'mindfulness';
  }> {
    const activities = [];

    if (breakDuration <= 2) {
      // Microbreak activities (40 seconds - 2 minutes)
      activities.push(
        {
          activity: 'View nature scenes',
          duration: 40,
          benefit: '23% attention improvement',
          type: 'nature' as const
        },
        {
          activity: 'Deep breathing (4-7-8)',
          duration: 60,
          benefit: 'Reduces cognitive load',
          type: 'mindfulness' as const
        },
        {
          activity: 'Eye movement exercises',
          duration: 30,
          benefit: 'Prevents eye strain',
          type: 'movement' as const
        }
      );
    } else if (breakDuration <= 10) {
      // Short break activities (2-10 minutes)
      activities.push(
        {
          activity: 'Light physical movement',
          duration: breakDuration * 60,
          benefit: '15% musculoskeletal improvement',
          type: 'movement' as const
        },
        {
          activity: 'Nature walk or window view',
          duration: breakDuration * 60,
          benefit: '20% working memory boost',
          type: 'nature' as const
        },
        {
          activity: 'Progressive muscle relaxation',
          duration: breakDuration * 60,
          benefit: 'Reduces mental fatigue',
          type: 'rest' as const
        }
      );
    } else {
      // Long break activities (10+ minutes)
      activities.push(
        {
          activity: 'Outdoor walk in nature',
          duration: Math.min(breakDuration * 60, 20 * 60),
          benefit: 'Maximum attention restoration',
          type: 'nature' as const
        },
        {
          activity: 'Light exercise or stretching',
          duration: breakDuration * 60,
          benefit: 'Boosts cognitive performance',
          type: 'movement' as const
        },
        {
          activity: 'Meditation or mindfulness',
          duration: breakDuration * 60,
          benefit: 'Enhances focus and clarity',
          type: 'mindfulness' as const
        }
      );
    }

    return activities;
  }

  // JITAI-inspired notification timing optimization
  getOptimalNotificationTime(profile: UserProfile, currentTime: Date): Date {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    
    // Peak engagement: 6-8am and 10pm-midnight
    // Tuesday/Wednesday show 8.4% higher response rates
    let optimalHour = hour;
    
    if (hour >= 22 || hour <= 8) {
      // Already in peak engagement window
      optimalHour = hour;
    } else if (profile.chronotype === 'morning') {
      // Morning types: suggest 7am next day
      optimalHour = 7;
    } else if (profile.chronotype === 'evening') {
      // Evening types: suggest 10pm same day
      optimalHour = 22;
    } else {
      // Intermediate types: next available peak window
      optimalHour = hour < 12 ? 7 : 22;
    }

    // Prefer Tuesday/Wednesday for maximum engagement
    let targetDay = dayOfWeek;
    if (dayOfWeek === 0 || dayOfWeek >= 4) { // Sunday or Thu-Sat
      targetDay = 2; // Tuesday
    }

    const notification = new Date(currentTime);
    notification.setHours(optimalHour, 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (notification <= currentTime) {
      notification.setDate(notification.getDate() + 1);
    }

    return notification;
  }
}