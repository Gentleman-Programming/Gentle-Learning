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

  // LECTOR Algorithm: LLM-Enhanced Concept-based Test-Oriented Repetition
  // Achieves 90.2% success rates with formula: I(t+1) = H_eff(t) × α_semantic × α_mastery × α_repetition × α_personal
  calculateLectorInterval(
    baseInterval: number,
    semanticInterference: number, // 0.8-1.2 based on concept similarity
    masteryLevel: number, // 0.5-2.0 based on performance history
    repetitionCount: number, // number of previous reviews
    personalFactor: number, // individual adaptation factor
    profile: UserProfile
  ): number {
    // LECTOR multipliers based on research
    const alphaSemantic = Math.max(0.8, Math.min(1.2, semanticInterference));
    const alphaMastery = Math.max(0.5, Math.min(2.0, masteryLevel));
    const alphaRepetition = Math.max(0.9, Math.min(1.1, 1.0 + (repetitionCount * 0.02))); // Slight boost per repetition
    const alphaPersonal = Math.max(0.7, Math.min(1.5, personalFactor));

    // Age and cognitive capacity adjustments
    let cognitiveAdjustment = 1.0;
    if (profile.age < 18) {
      cognitiveAdjustment = 0.85; // Shorter intervals for younger learners
    } else if (profile.age > 60) {
      cognitiveAdjustment = 0.9; // Slightly shorter for older learners
    }

    const lectorInterval = baseInterval * alphaSemantic * alphaMastery * alphaRepetition * alphaPersonal * cognitiveAdjustment;
    
    return Math.max(1, Math.round(lectorInterval));
  }

  // Enhanced performance tracking for LECTOR algorithm
  calculatePerformanceMetrics(
    responseTimes: number[],
    accuracyScores: number[],
    sessionCompletionRates: number[]
  ): {
    masteryLevel: number;
    personalFactor: number;
    consistencyScore: number;
  } {
    if (responseTimes.length === 0 || accuracyScores.length === 0) {
      return { masteryLevel: 1.0, personalFactor: 1.0, consistencyScore: 0.5 };
    }

    // Calculate mastery level (0.5-2.0)
    const avgAccuracy = accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length;
    const avgCompletion = sessionCompletionRates.reduce((a, b) => a + b, 0) / sessionCompletionRates.length;
    const masteryLevel = Math.max(0.5, Math.min(2.0, (avgAccuracy + avgCompletion) / 100));

    // Calculate personal adaptation factor based on response time consistency
    const meanRT = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const rtVariance = responseTimes.reduce((sum, rt) => sum + Math.pow(rt - meanRT, 2), 0) / responseTimes.length;
    const rtStd = Math.sqrt(rtVariance);
    const coefficientOfVariation = rtStd / meanRT;
    
    // Lower CV indicates more consistent performance = higher personal factor
    const personalFactor = Math.max(0.7, Math.min(1.5, 1.5 - coefficientOfVariation));

    // Consistency score for UI display
    const consistencyScore = Math.max(0, Math.min(1, 1 - coefficientOfVariation));

    return { masteryLevel, personalFactor, consistencyScore };
  }

  // Semantic interference calculation for related concepts
  calculateSemanticInterference(
    currentConcept: string,
    recentConcepts: string[],
    conceptSimilarityMatrix?: Map<string, Map<string, number>>
  ): number {
    if (recentConcepts.length === 0) {
      return 1.0; // No interference
    }

    if (conceptSimilarityMatrix) {
      // Use provided similarity matrix if available
      const similarities = recentConcepts
        .map(concept => conceptSimilarityMatrix.get(currentConcept)?.get(concept) || 0)
        .filter(similarity => similarity > 0);
      
      if (similarities.length > 0) {
        const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
        return Math.max(0.8, Math.min(1.2, 1.0 + (avgSimilarity * 0.4))); // Convert to interference factor
      }
    }

    // Fallback: simple keyword-based similarity
    const conceptWords = currentConcept.toLowerCase().split(/\s+/);
    let maxSimilarity = 0;

    for (const recentConcept of recentConcepts) {
      const recentWords = recentConcept.toLowerCase().split(/\s+/);
      const commonWords = conceptWords.filter(word => recentWords.includes(word));
      const similarity = commonWords.length / Math.max(conceptWords.length, recentWords.length);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    // Convert similarity to interference factor (0.8-1.2)
    return Math.max(0.8, Math.min(1.2, 1.0 + (maxSimilarity * 0.4)));
  }

  // Adaptive fatigue detection with multiple intervention levels
  assessFatigueLevel(
    responseTimeHistory: number[],
    errorRateHistory: number[],
    selfReportedFatigue: number // 1-10 scale
  ): {
    fatigueLevel: 'low' | 'moderate' | 'high' | 'severe';
    interventionRecommended: 'continue' | 'microbreak' | 'break' | 'stop';
    confidence: number;
  } {
    if (responseTimeHistory.length < 3) {
      return { 
        fatigueLevel: 'low', 
        interventionRecommended: 'continue', 
        confidence: 0.3 
      };
    }

    // Calculate recent performance trends
    const recentRTs = responseTimeHistory.slice(-5);
    const recentErrors = errorRateHistory.slice(-5);
    
    const rtTrend = recentRTs.length > 1 ? 
      (recentRTs[recentRTs.length - 1] - recentRTs[0]) / recentRTs.length : 0;
    const errorTrend = recentErrors.length > 1 ? 
      (recentErrors[recentErrors.length - 1] - recentErrors[0]) / recentErrors.length : 0;

    // Combine objective and subjective measures
    let fatigueScore = 0;
    
    // Response time degradation (0-3 points)
    if (rtTrend > 500) fatigueScore += 3; // >500ms increase
    else if (rtTrend > 200) fatigueScore += 2;
    else if (rtTrend > 100) fatigueScore += 1;

    // Error rate increase (0-3 points)
    if (errorTrend > 0.2) fatigueScore += 3; // >20% error increase
    else if (errorTrend > 0.1) fatigueScore += 2;
    else if (errorTrend > 0.05) fatigueScore += 1;

    // Self-reported fatigue (0-4 points)
    if (selfReportedFatigue >= 8) fatigueScore += 4;
    else if (selfReportedFatigue >= 6) fatigueScore += 3;
    else if (selfReportedFatigue >= 4) fatigueScore += 2;
    else if (selfReportedFatigue >= 2) fatigueScore += 1;

    // Determine fatigue level and intervention
    let fatigueLevel: 'low' | 'moderate' | 'high' | 'severe';
    let interventionRecommended: 'continue' | 'microbreak' | 'break' | 'stop';
    
    if (fatigueScore <= 2) {
      fatigueLevel = 'low';
      interventionRecommended = 'continue';
    } else if (fatigueScore <= 4) {
      fatigueLevel = 'moderate';
      interventionRecommended = 'microbreak';
    } else if (fatigueScore <= 7) {
      fatigueLevel = 'high';
      interventionRecommended = 'break';
    } else {
      fatigueLevel = 'severe';
      interventionRecommended = 'stop';
    }

    // Confidence based on data availability
    const confidence = Math.min(1.0, responseTimeHistory.length / 10);

    return { fatigueLevel, interventionRecommended, confidence };
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

  // Interleaved Practice Algorithm (Cohen's d = 0.83 vs blocked practice)
  // Optimizes topic mixing for maximum learning benefit
  generateInterleavedSchedule(
    topics: Array<{
      id: string;
      name: string;
      difficulty: number; // 1-5 scale
      timeRequired: number; // minutes
      lastStudied?: Date;
      masteryLevel?: number; // 0-1 scale
    }>,
    totalSessionTime: number,
    profile: UserProfile
  ): Array<{
    topicId: string;
    topicName: string;
    duration: number;
    order: number;
    rationale: string;
  }> {
    if (topics.length <= 1) {
      return topics.map((topic, index) => ({
        topicId: topic.id,
        topicName: topic.name,
        duration: Math.min(topic.timeRequired, totalSessionTime),
        order: index,
        rationale: 'Single topic - no interleaving needed'
      }));
    }

    // Calculate interleaving benefit scores
    const topicsWithScores = topics.map(topic => {
      let interleavingScore = 1.0;
      
      // Factor 1: Difficulty variation (higher score for mixed difficulty)
      const avgDifficulty = topics.reduce((sum, t) => sum + t.difficulty, 0) / topics.length;
      const difficultyVariation = Math.abs(topic.difficulty - avgDifficulty) / 5;
      interleavingScore += difficultyVariation * 0.3;
      
      // Factor 2: Recency (higher score for less recently studied)
      if (topic.lastStudied) {
        const daysSinceStudied = (Date.now() - topic.lastStudied.getTime()) / (1000 * 60 * 60 * 24);
        interleavingScore += Math.min(daysSinceStudied / 7, 1) * 0.4; // Max boost for 7+ days
      } else {
        interleavingScore += 0.4; // New topics get priority
      }
      
      // Factor 3: Mastery level (lower mastery = higher interleaving benefit)
      const masteryPenalty = (topic.masteryLevel || 0.5) * 0.3;
      interleavingScore += (1 - masteryPenalty);
      
      return { ...topic, interleavingScore };
    });

    // Sort by interleaving benefit
    topicsWithScores.sort((a, b) => b.interleavingScore - a.interleavingScore);

    // Generate optimal sequence using research-based patterns
    const schedule: Array<{
      topicId: string;
      topicName: string;
      duration: number;
      order: number;
      rationale: string;
    }> = [];

    let remainingTime = totalSessionTime;
    let order = 0;
    
    // Apply optimal interleaving patterns based on cognitive load theory
    const maxConcurrentTopics = Math.min(
      profile.workingMemoryCapacity || 4,
      topics.length,
      3 // Research shows diminishing returns beyond 3 topics
    );

    const selectedTopics = topicsWithScores.slice(0, maxConcurrentTopics);
    
    // Calculate time allocation using spaced distribution
    const totalRequiredTime = selectedTopics.reduce((sum, topic) => sum + topic.timeRequired, 0);
    const timeRatio = Math.min(1, remainingTime / totalRequiredTime);
    
    // Implement research-based interleaving pattern: A-B-C-A-B-C
    let topicIndex = 0;
    while (remainingTime > 5 && selectedTopics.some(t => t.timeRequired > 0)) {
      const currentTopic = selectedTopics[topicIndex % selectedTopics.length];
      
      if (currentTopic.timeRequired <= 0) {
        topicIndex++;
        continue;
      }
      
      // Calculate segment duration (10-20 minutes optimal for interleaving)
      const baseSegmentTime = Math.min(
        15, // Optimal segment length from research
        currentTopic.timeRequired,
        remainingTime,
        Math.max(5, remainingTime / (selectedTopics.filter(t => t.timeRequired > 0).length))
      );
      
      // Adjust for difficulty (harder topics get slightly longer segments)
      const difficultyAdjustment = 1 + ((currentTopic.difficulty - 3) * 0.1);
      const segmentDuration = Math.round(baseSegmentTime * difficultyAdjustment);
      
      const rationale = this.generateInterleavingRationale(
        currentTopic,
        selectedTopics,
        order,
        segmentDuration
      );
      
      schedule.push({
        topicId: currentTopic.id,
        topicName: currentTopic.name,
        duration: segmentDuration,
        order: order++,
        rationale
      });
      
      currentTopic.timeRequired -= segmentDuration;
      remainingTime -= segmentDuration;
      topicIndex++;
    }

    return schedule;
  }

  private generateInterleavingRationale(
    currentTopic: any,
    allTopics: any[],
    order: number,
    duration: number
  ): string {
    const isFirstSegment = order === 0;
    const isHardTopic = currentTopic.difficulty >= 4;
    const isNewTopic = !currentTopic.lastStudied;
    
    if (isFirstSegment) {
      if (isHardTopic) {
        return `Starting with challenging topic while mental energy is highest`;
      } else if (isNewTopic) {
        return `Beginning with new topic for optimal encoding`;
      } else {
        return `Opening with this topic based on optimal difficulty progression`;
      }
    } else {
      if (currentTopic.difficulty > allTopics[0]?.difficulty) {
        return `Interleaving harder topic to enhance discrimination learning (${duration}min segment)`;
      } else {
        return `Switching topics to prevent interference and maintain engagement (${duration}min segment)`;
      }
    }
  }

  // Calculate optimal topic switching intervals for interleaved practice
  calculateSwitchingInterval(
    topicDifficulty: number,
    userAttentionSpan: number,
    masteryLevel: number
  ): number {
    // Base interval from research: 10-20 minutes optimal
    let baseInterval = 15;
    
    // Adjust for difficulty (harder topics benefit from slightly longer segments)
    const difficultyAdjustment = 1 + ((topicDifficulty - 3) * 0.15);
    
    // Adjust for mastery (lower mastery = shorter segments for more frequent switching)
    const masteryAdjustment = 0.7 + (masteryLevel * 0.6);
    
    // Adjust for attention span
    const attentionAdjustment = Math.min(1.5, userAttentionSpan / 30);
    
    const optimalInterval = baseInterval * difficultyAdjustment * masteryAdjustment * attentionAdjustment;
    
    return Math.max(5, Math.min(25, Math.round(optimalInterval)));
  }

  // Analyze interleaving effectiveness for continuous optimization
  analyzeInterleavingEffectiveness(
    sessionHistory: Array<{
      topicId: string;
      duration: number;
      performance: number; // 0-1 scale
      switchedFrom?: string;
      order: number;
    }>
  ): {
    overallEffectiveness: number;
    switchingBenefit: number;
    optimalSegmentLength: number;
    recommendations: string[];
  } {
    if (sessionHistory.length < 2) {
      return {
        overallEffectiveness: 0.5,
        switchingBenefit: 0,
        optimalSegmentLength: 15,
        recommendations: ['Need more data to analyze interleaving effectiveness']
      };
    }

    // Calculate performance trends
    const performanceByOrder = sessionHistory.map(s => s.performance);
    const avgPerformance = performanceByOrder.reduce((a, b) => a + b, 0) / performanceByOrder.length;
    
    // Analyze switching benefit
    const switchingSegments = sessionHistory.filter(s => s.switchedFrom);
    const nonSwitchingSegments = sessionHistory.filter(s => !s.switchedFrom);
    
    const switchingPerformance = switchingSegments.length > 0 ?
      switchingSegments.reduce((sum, s) => sum + s.performance, 0) / switchingSegments.length : 0;
    const nonSwitchingPerformance = nonSwitchingSegments.length > 0 ?
      nonSwitchingSegments.reduce((sum, s) => sum + s.performance, 0) / nonSwitchingSegments.length : 0;
    
    const switchingBenefit = switchingPerformance - nonSwitchingPerformance;
    
    // Find optimal segment length
    const segmentLengths = sessionHistory.map(s => s.duration);
    const performanceByLength = new Map<number, number[]>();
    
    sessionHistory.forEach(segment => {
      const lengthBucket = Math.floor(segment.duration / 5) * 5; // 5-minute buckets
      if (!performanceByLength.has(lengthBucket)) {
        performanceByLength.set(lengthBucket, []);
      }
      performanceByLength.get(lengthBucket)!.push(segment.performance);
    });
    
    let optimalLength = 15; // default
    let bestPerformance = 0;
    
    performanceByLength.forEach((performances, length) => {
      const avgPerf = performances.reduce((a, b) => a + b, 0) / performances.length;
      if (avgPerf > bestPerformance && performances.length >= 2) {
        bestPerformance = avgPerf;
        optimalLength = length;
      }
    });
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (switchingBenefit > 0.1) {
      recommendations.push('Interleaving is highly effective - continue current approach');
    } else if (switchingBenefit < -0.1) {
      recommendations.push('Consider longer segments or fewer topic switches');
    } else {
      recommendations.push('Interleaving showing neutral effect - monitor for patterns');
    }
    
    if (optimalLength < 10) {
      recommendations.push('Try slightly longer topic segments for deeper processing');
    } else if (optimalLength > 20) {
      recommendations.push('Consider more frequent topic switches to enhance discrimination');
    }
    
    return {
      overallEffectiveness: avgPerformance,
      switchingBenefit,
      optimalSegmentLength: optimalLength,
      recommendations
    };
  }
}