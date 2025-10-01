import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  model,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      {{ data.description }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button color="secondary" mat-flat-button mat-dialog-close>Cancelar</button>
      <button color="primary" mat-flat-button mat-dialog-close cdkFocusInitial (click)="confirm()">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }
}
