import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.sass']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  confirmation = "";
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) { }

  ngOnInit(): void {

  }

  cancelDialog() {
    this.dialogRef.close()
  }

  closeDialog() {
    console.log("this.confirmation");
    console.log(this.confirmation);
    this.dialogRef.close(this.confirmation);
  }

}
