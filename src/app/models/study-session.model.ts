export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // minutes
  actualDuration?: number; // minutes
  breaksTaken: Break[];
  performance: SessionPerformance;
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  sessionType: 'study' | 'review' | 'practice';
}

export interface Break {
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  type: 'micro' | 'short' | 'long';
  activity?: 'nature' | 'movement' | 'rest' | 'other';
}

export interface SessionPerformance {
  focusScore: number; // 0-100
  completionRate: number; // 0-100
  errorsCount: number;
  selfReportedFatigue: number; // 1-10
  averageResponseTime?: number; // milliseconds
}

export interface StudySchedule {
  userId: string;
  sessions: ScheduledSession[];
  optimizedForChronotype: boolean;
  lastUpdated: Date;
}

export interface ScheduledSession {
  id: string;
  subject: string;
  scheduledStart: Date;
  duration: number; // minutes
  breakDuration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  notificationScheduled: boolean;
}