// src/app/features/notifications/notification-center/notification-center.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { interval, Subscription } from 'rxjs';

interface Notification {
  id: number;
  message: string;
  type: string; // e.g., 'Order Update', 'Stock Alert', etc.
  createdAt: string;
  read: boolean;
}

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  loading = false;
  error: string | null = null;
  pollingSubscription!: Subscription;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchNotifications();

    // Optionally set up polling every 30 seconds for real-time updates
    this.pollingSubscription = interval(30000).subscribe(() => {
      this.fetchNotifications();
    });

    // Alternatively, if using WebSockets, initialize the WebSocket connection here.
  }

  fetchNotifications(): void {
    this.loading = true;
    this.error = null;
    this.apiService.get<Notification[]>('notifications')
      .subscribe({
        next: data => {
          // Optionally sort notifications by date (most recent first)
          this.notifications = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch notifications.';
          this.loading = false;
        }
      });
  }

  markAsRead(notification: Notification): void {
    // Mark a notification as read by calling an API endpoint
    this.apiService.put(`notifications/${notification.id}`, { read: true })
      .subscribe({
        next: () => {
          notification.read = true;
        },
        error: () => {
          console.error('Failed to update notification status');
        }
      });
  }

  ngOnDestroy(): void {
    // Clean up polling subscription to avoid memory leaks
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
