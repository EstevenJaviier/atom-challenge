import {
  Component,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ITask } from '../../core/interfaces/task.interface';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { TasksService } from '../../core/services/tasks.service';
import { MatButtonModule } from '@angular/material/button';
import { FormDatePipe } from '../../core/pipes/formDate.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatListModule,
    DatePipe,
    NgFor,
    NgIf,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormDatePipe,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
  taskList = signal<ITask[] | null>(null);
  isLoading = signal<boolean>(false);

  private router = inject(Router);
  private taskService = inject(TasksService);
  readonly dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.isLoading.set(true);
    this.taskList.set([]);
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.taskList.set(data);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  trackByFn = (_i: number, task: ITask) => task.id;

  handleTask(task?: ITask) {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '450px',
    });

    dialogRef.componentInstance.task = task;

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getTasks();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleCompletion(task: ITask) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    task.isCompleted = !task.isCompleted;

    this.taskService.updateTask(task.id ?? '', updatedTask).subscribe({
      next: (data) => {
        this.notificationService.showSuccess(
          'Estado actualizado exitosamente.'
        );
      },
      error: (err) => {
        this.notificationService.showSuccess('Ha ocurido un error inesperado.');
        task.isCompleted = !task.isCompleted;
      },
    });
  }

  deleteTask(task: ITask) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        description: `¿Estás seguro de que quieres eliminar la tarea '${task.title}'?`,
        width: '250px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (Boolean(result)) {
        this.taskService.deleteTask(task.id ?? '').subscribe({
          next: (data) => {
            this.isLoading.set(false);
            this.taskList.update((tasks) =>
              (tasks ?? []).filter((data) => data.id !== task.id)
            );
            this.notificationService.showError('Tarea eliminada exitosamnte.');
          },
          error: (err) => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }
}
