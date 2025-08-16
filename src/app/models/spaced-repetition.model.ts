export interface StudyItem {
  id: string;
  userId: string;
  subject: string;
  content: string;
  difficulty: number; // 1-5
  easeFactor: number; // Starting at 2.5
  interval: number; // days
  repetitions: number;
  lastReviewed?: Date;
  nextReview: Date;
  quality?: number; // 0-5, quality of last response
}

export interface ReviewSession {
  id: string;
  userId: string;
  items: ReviewItem[];
  startTime: Date;
  endTime?: Date;
  completionRate: number;
}

export interface ReviewItem {
  studyItemId: string;
  responseQuality: number; // 0-5
  responseTime: number; // milliseconds
  correct: boolean;
  reviewedAt: Date;
}