import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { StudyOptimizerService } from '../../services/study-optimizer.service';
import { UserProfile, AssessmentQuestion, AssessmentAnswer, ChronoType, StudyIntensity } from '../../models/user-profile.model';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AssessmentComponent {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private optimizerService = inject(StudyOptimizerService);
  private router = inject(Router);

  currentStep = signal(0);
  assessmentAnswers = signal<AssessmentAnswer[]>([]);
  startTime = signal<number>(Date.now());
  responseTimes = signal<number[]>([]);
  errors = signal<number[]>([]);

  assessmentForm = this.fb.group({
    name: ['', Validators.required],
    age: [18, [Validators.required, Validators.min(7), Validators.max(100)]],
    studyIntensity: ['casual' as StudyIntensity, Validators.required]
  });

  chronotypeForm = this.fb.group({
    wakeTime: ['', Validators.required],
    productiveTime: ['', Validators.required],
    sleepTime: ['', Validators.required],
    energyPattern: ['', Validators.required]
  });

  questions: AssessmentQuestion[] = [
    {
      id: 'wake-time',
      question: 'What time do you naturally wake up without an alarm?',
      type: 'time-preference',
      options: ['Before 6 AM', '6-7 AM', '7-8 AM', '8-9 AM', 'After 9 AM']
    },
    {
      id: 'productive-time',
      question: 'When do you feel most mentally alert and productive?',
      type: 'time-preference',
      options: ['Early morning (6-9 AM)', 'Late morning (9 AM-12 PM)', 'Early afternoon (12-3 PM)', 'Late afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (after 9 PM)']
    },
    {
      id: 'sleep-time',
      question: 'What time do you prefer to go to sleep?',
      type: 'time-preference',
      options: ['Before 9 PM', '9-10 PM', '10-11 PM', '11 PM-12 AM', 'After midnight']
    },
    {
      id: 'energy-pattern',
      question: 'How would you describe your energy levels throughout the day?',
      type: 'multiple-choice',
      options: ['Highest in morning, decreases throughout day', 'Low in morning, peaks midday', 'Steady throughout the day', 'Low in morning, highest in evening']
    },
    {
      id: 'focus-duration',
      question: 'How long can you typically maintain deep focus on a challenging task?',
      type: 'multiple-choice',
      options: ['Less than 15 minutes', '15-30 minutes', '30-45 minutes', '45-60 minutes', 'More than 60 minutes']
    },
    {
      id: 'break-preference',
      question: 'What type of break activity helps you recover best?',
      type: 'multiple-choice',
      options: ['Physical movement/exercise', 'Looking at nature/outdoors', 'Social interaction', 'Complete rest/meditation', 'Light entertainment']
    },
    {
      id: 'distraction-level',
      question: 'How easily are you distracted during study sessions?',
      type: 'scale',
      minValue: 1,
      maxValue: 5
    },
    {
      id: 'motivation-level',
      question: 'Rate your typical motivation level for studying:',
      type: 'scale',
      minValue: 1,
      maxValue: 5
    }
  ];

  totalSteps = computed(() => 1 + this.questions.length + 1); // Initial form + questions + final step
  progress = computed(() => (this.currentStep() / this.totalSteps()) * 100);

  isLastStep = computed(() => this.currentStep() === this.totalSteps() - 1);

  nextStep(): void {
    if (this.currentStep() < this.totalSteps() - 1) {
      this.currentStep.update(step => step + 1);
      // Set start time for measuring response time
      this.startTime.set(Date.now());
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(step => step - 1);
    }
  }

  recordAnswer(questionId: string, value: string | number): void {
    const responseTime = Date.now() - this.startTime();
    
    this.assessmentAnswers.update(answers => [
      ...answers.filter(a => a.questionId !== questionId),
      {
        questionId,
        value,
        responseTime,
        timestamp: new Date()
      }
    ]);

    this.responseTimes.update(times => [...times, responseTime]);
    
    // Automatically advance to next step
    this.nextStep();
  }

  completeAssessment(): void {
    const formData = this.assessmentForm.value;
    const chronotypeData = this.chronotypeForm.value;
    const answers = this.assessmentAnswers();

    // Calculate chronotype based on answers
    const chronotype = this.calculateChronotype(chronotypeData, answers);
    const chronotypeScore = this.calculateChronotypeScore(chronotypeData, answers);

    // Calculate attention span from response times
    const attentionSpan = this.optimizerService.assessAttentionSpan(
      this.responseTimes(),
      this.errors()
    );

    // Create user profile
    const userProfile: UserProfile = {
      id: this.generateId(),
      name: formData.name || '',
      age: formData.age || 18,
      chronotype,
      chronotypeScore,
      studyIntensity: formData.studyIntensity as StudyIntensity,
      assessmentCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sustainedAttentionSpan: attentionSpan,
      workingMemoryCapacity: this.estimateWorkingMemory(formData.age || 18)
    };

    // Calculate optimal study parameters
    const studyParams = this.optimizerService.calculateOptimalStudySchedule(userProfile);
    
    userProfile.optimalSessionLength = studyParams.sessionLength;
    userProfile.optimalBreakDuration = studyParams.breakDuration;
    userProfile.peakPerformanceTime = studyParams.optimalStartTime;

    // Save to storage
    this.storageService.saveUserProfile(userProfile);
    
    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  private calculateChronotype(chronotypeData: any, answers: AssessmentAnswer[]): ChronoType {
    const wakeTimeAnswer = answers.find(a => a.questionId === 'wake-time');
    const productiveTimeAnswer = answers.find(a => a.questionId === 'productive-time');
    const sleepTimeAnswer = answers.find(a => a.questionId === 'sleep-time');

    let morningScore = 0;
    let eveningScore = 0;

    // Score based on wake time
    if (wakeTimeAnswer) {
      const wakeIndex = this.questions[0].options?.indexOf(wakeTimeAnswer.value as string) || 2;
      if (wakeIndex < 2) morningScore += 2;
      if (wakeIndex > 3) eveningScore += 2;
    }

    // Score based on productive time
    if (productiveTimeAnswer) {
      const productiveIndex = this.questions[1].options?.indexOf(productiveTimeAnswer.value as string) || 2;
      if (productiveIndex < 2) morningScore += 2;
      if (productiveIndex > 3) eveningScore += 2;
    }

    // Score based on sleep time
    if (sleepTimeAnswer) {
      const sleepIndex = this.questions[2].options?.indexOf(sleepTimeAnswer.value as string) || 2;
      if (sleepIndex < 2) morningScore += 2;
      if (sleepIndex > 3) eveningScore += 2;
    }

    if (morningScore > eveningScore + 2) return 'morning';
    if (eveningScore > morningScore + 2) return 'evening';
    return 'intermediate';
  }

  private calculateChronotypeScore(chronotypeData: any, answers: AssessmentAnswer[]): number {
    // Returns a score from 1 (extreme morning) to 5 (extreme evening)
    const wakeTimeAnswer = answers.find(a => a.questionId === 'wake-time');
    const sleepTimeAnswer = answers.find(a => a.questionId === 'sleep-time');
    
    let score = 3; // Start with intermediate
    
    if (wakeTimeAnswer) {
      const wakeIndex = this.questions[0].options?.indexOf(wakeTimeAnswer.value as string) || 2;
      score += (wakeIndex - 2) * 0.5;
    }
    
    if (sleepTimeAnswer) {
      const sleepIndex = this.questions[2].options?.indexOf(sleepTimeAnswer.value as string) || 2;
      score += (sleepIndex - 2) * 0.5;
    }
    
    return Math.max(1, Math.min(5, score));
  }

  private estimateWorkingMemory(age: number): number {
    if (age < 12) return 2.5;
    if (age < 18) return 3.5;
    if (age < 60) return 4;
    return 3.5;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isQuestionStep(step: number): boolean {
    return step >= 1 && step <= this.questions.length;
  }
}