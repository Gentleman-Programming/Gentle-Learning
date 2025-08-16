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
      microbreakInterval: 15, // minutes
      microbreakDuration: 40, // seconds
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

    if (profile.studyIntensity === 'intensive') {
      // For intensive study (exams, deadlines)
      sessionLength = Math.min(baseParams.attentionSpan, 45);
      breakDuration = sessionLength * 0.15; // Shorter breaks for intensive
    } else {
      // For casual study (long-term learning)
      sessionLength = Math.min(baseParams.attentionSpan, this.ULTRADIAN_CYCLE * 0.8);
      breakDuration = sessionLength * 0.22; // Optimal break ratio
    }

    // Apply 52/17 ratio if appropriate
    if (profile.age >= 18 && profile.age <= 60 && !profile.studyIntensity) {
      sessionLength = this.OPTIMAL_52_17_RATIO.work;
      breakDuration = this.OPTIMAL_52_17_RATIO.break;
    }

    const maxConcepts = Math.floor(baseParams.workingMemoryCapacity * 0.8);

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
}