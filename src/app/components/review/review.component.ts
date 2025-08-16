import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  template: `
    <div class="review-container">
      <h2>Review Items</h2>
      <p>Spaced repetition review coming soon!</p>
    </div>
  `,
  styles: [`
    .review-container {
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
export class ReviewComponent {}