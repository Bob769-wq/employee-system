import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadingComponent } from '../components/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  dialog = inject(MatDialog);
  dialogRef: MatDialogRef<LoadingComponent> | undefined;

  show() {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(LoadingComponent, {
      width: '30rem',
      height: '30rem',
      maxWidth: '80vw',
      maxHeight: '80vh',
      disableClose: true,
    });
  }
}
