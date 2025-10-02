import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../../core/services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<null>();

  loginForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage: string | null = null;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);

  constructor() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    });
  }

  submitLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage = null;

    const { email } = this.loginForm.value;

    this.usersService.findUser(email).subscribe({
      next: (data) => {
        localStorage.setItem('token', data ?? '');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 404) {
          this.createUserDialog();
        }

        this.errorMessage =
          error?.error?.message || 'Ocurrió un error inesperado.';
      },
    });
  }

  createUserDialog() {
    const { email } = this.loginForm.value;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Usuario no registrado',
        description: `¿Deseas crear una cuenta con '${email}'?`,
        width: '250px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (Boolean(result)) {
        this.isLoading.set(true);
        this.errorMessage = null;
        this.usersService.createUser({ email }).subscribe({
          next: (data) => {
            localStorage.setItem('token', data ?? '');
            this.router.navigate(['/tasks']);
          },
          error: (err) => {
            this.isLoading.set(false);
          },
        });
      }
    });
  }
}
