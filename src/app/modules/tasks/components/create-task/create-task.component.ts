import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TasksService } from '../../../../core/services/tasks.service';
import { ITask } from '../../../../core/interfaces/task.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  @Input() set task(task: ITask | undefined) {
    if (task) {
      this.taskForm.patchValue(task);
    }
  }

  taskForm!: FormGroup;
  isLoading = signal<boolean>(false);

  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateTaskComponent>);
  private tasksService = inject(TasksService);
  private notificationService = inject(NotificationService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.taskForm = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      description: [null],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const { id, title, description } = this.taskForm.value;
      this.isLoading.set(true);
      (this.taskForm.get('id')?.value
        ? this.tasksService.updateTask(id, { title, description })
        : this.tasksService.createTask({ title, description })
      ).subscribe({
        next: (data) => {
          this.notificationService.showSuccess(
            this.taskForm.get('id')?.value
              ? 'Tarea actualizada exitosamente.'
              : 'Tarea creada exitosamente.'
          );
          this.dialogRef.close(data);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    }
  }
}
