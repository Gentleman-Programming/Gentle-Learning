import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-container">
      <h2>Settings</h2>
      
      <div class="settings-section">
        <h3>Notifications</h3>
        <button (click)="requestNotificationPermission()" class="permission-button">
          Enable Push Notifications
        </button>
        <p class="status">Status: {{ notificationService.permission() }}</p>
      </div>

      <div class="settings-section">
        <h3>Data Management</h3>
        <button (click)="clearData()" class="danger-button">
          Clear All Data
        </button>
        <p class="warning">This will delete all your study data and cannot be undone.</p>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: var(--spacing-xl);
      background: var(--background-card);
      border-radius: var(--border-radius-lg);
      box-shadow: 0 4px 6px var(--shadow-primary);
      border: 1px solid var(--background-border);
      
      h2 {
        margin-bottom: var(--spacing-xl);
        color: var(--text-primary);
      }

      .settings-section {
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 1px solid var(--background-border);

        h3 {
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
        }

        .permission-button {
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: var(--text-on-primary);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          transition: all var(--transition-base);

          &:hover {
            background: var(--primary-light);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-primary-focus);
          }
        }

        .danger-button {
          padding: 0.75rem 1.5rem;
          background: var(--error-color);
          color: var(--text-on-primary);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          transition: all var(--transition-base);

          &:hover {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        }

        .status {
          margin-top: var(--spacing-md);
          color: var(--text-reading);
        }

        .warning {
          margin-top: var(--spacing-sm);
          color: var(--error-color);
          font-size: var(--font-size-sm);
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SettingsComponent {
  storageService = inject(StorageService);
  notificationService = inject(NotificationService);

  async requestNotificationPermission() {
    await this.notificationService.requestPermission();
  }

  clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      this.storageService.clearAllData();
      window.location.reload();
    }
  }
}