import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-person',
  templateUrl: './dialog-delete-person.component.html',
  styleUrls: ['./dialog-delete-person.component.scss']
})
export class DialogDeletePersonComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDeletePersonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  deletePerson() {
    this.dialogRef.close();
  }

}
