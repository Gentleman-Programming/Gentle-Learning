export type ChronoType = 'morning' | 'evening' | 'intermediate';
export type StudyIntensity = 'intensive' | 'casual';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  chronotype?: ChronoType;
  chronotypeScore?: number; // 1-5 scale
  studyIntensity: StudyIntensity;
  assessmentCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Assessment results
  sustainedAttentionSpan?: number; // in seconds
  workingMemoryCapacity?: number; // number of chunks
  optimalSessionLength?: number; // in minutes
  optimalBreakDuration?: number; // in minutes
  peakPerformanceTime?: number; // minutes from midnight
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'time-preference';
  options?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | number;
  responseTime: number; // milliseconds
  timestamp: Date;
}