import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarRef,
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { NotificationData } from '../../../core/interfaces/notification.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule, NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  snackBarRef = inject(MatSnackBarRef);

  data: NotificationData = inject(MAT_SNACK_BAR_DATA);
}
