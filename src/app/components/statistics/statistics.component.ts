import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  template: `
    <div class="statistics-container">
      <h2>Study Statistics</h2>
      <p>Detailed analytics and progress tracking coming soon!</p>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: var(--spacing-xl);
      background: var(--background-card);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 4px 6px var(--shadow-primary);
      border: 1px solid var(--background-border);
      
      h2 {
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
      }

      p {
        color: var(--text-reading);
        line-height: 1.6;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class StatisticsComponent {}