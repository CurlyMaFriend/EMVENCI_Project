import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-dialog-edit-person',
  templateUrl: './dialog-edit-person.component.html',
  styleUrls: ['./dialog-edit-person.component.scss']
})
export class DialogEditPersonComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DialogEditPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  id!: number;
  formGroup!: FormGroup;
  snackBarRef: any;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.id = this.data.person.id;
    this.formGroup = new FormGroup({
      username: new FormControl(this.data.person.username, [Validators.required]),
      password: new FormControl(this.data.person.password, [Validators.required]),
      name: new FormControl(this.data.person.name),
      age: new FormControl(this.data.person.age),
      role: new FormControl(this.data.person.role, [Validators.required]),
    })
  }

  editPerson() {
    console.log(this.formGroup);
    console.log(this.id);
    if (this.formGroup.valid) {
      this.authService.editPerson(this.formGroup.value, localStorage.getItem('token'), this.id).subscribe((result) => {
        console.log(result);
        this.openSnackBar("Person Updated with success", "Ok!", true);
      }, (error) => {
        if (error.status === 403) {
          this.openSnackBar("Session Expirated, Please login", "Ok", false);
          this.router.navigate(['login']);
        } else if (error.status === 400) {
          this.openSnackBar("Error trying to update Person!", "Ok", false);
        } else if (error.status === 500) {
          this.openSnackBar("Something went wrong... Please try to login again.", "Ok", false);
          this.snackBarRef.afterDismissed().subscribe(() => {
            this.router.navigate(['login']);
          })
        } else {
          this.openSnackBar("Error: " + error.status, "Ok", false);
          console.log(error);
        }
      })
      this.dialogRef.close(123);
    } else {
      console.log("not valid");
    }
  }

  openSnackBar(message: string, button: string, success: boolean) {

    let configClass: string[];
    if (success) {
      configClass = ['custom-success']
    } else {
      configClass = ['custom-warn']
    }
    this.snackBarRef = this.snackBar.open(message, button, {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 2000,
      panelClass: configClass
    });
  }
}
