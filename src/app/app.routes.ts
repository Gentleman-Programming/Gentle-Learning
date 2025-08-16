import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'assessment',
    loadComponent: () => import('./components/assessment/assessment.component').then(m => m.AssessmentComponent)
  },
  {
    path: 'session',
    loadComponent: () => import('./components/study-session/study-session.component').then(m => m.StudySessionComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'review',
    loadComponent: () => import('./components/review/review.component').then(m => m.ReviewComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/statistics/statistics.component').then(m => m.StatisticsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  }
];
