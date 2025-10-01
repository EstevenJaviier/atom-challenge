import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NotificationData,
  NotificationType,
} from '../interfaces/notification.interface';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string, duration: number = 4000): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 6000): void {
    this.show(message, 'error', duration);
  }

  private show(
    message: string,
    type: NotificationType,
    duration: number
  ): void {
    const data: NotificationData = { message, type };

    this.snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
