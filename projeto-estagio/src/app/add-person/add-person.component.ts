import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {

  formGroup!: FormGroup;
  snackBarRef: any;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (localStorage.getItem('role') === "normal") {
      this.router.navigate(['persons']);
    }
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      age: new FormControl(''),
      role: new FormControl('', [Validators.required]),
    })
  }

  addPerson() {
    if (this.formGroup.valid) {
      this.authService.addPerson(this.formGroup.value, localStorage.getItem('token')).subscribe((response) => {
        console.log(response)
        this.router.navigate(['persons']);
      }, (error) => {
        let message: string;
        if (error.status == 403) {
          message = "Session expired. Please login again!";
        } else {
          message = "Something went wrong. Please try to login again!";
        }
        this.openSnackBar(message, "Ok", false);
        this.snackBarRef.afterDismissed().subscribe(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.router.navigate(['login']);
        })
      })
    } else {
      console.log("not valid");
    }
  }

  goToPersons() {
    this.router.navigate(['persons']);
  }

  openSnackBar(message: string, button: string, success: boolean) {

    let configClass: string[];
    if (success) {
      configClass = ['custom-success']
    } else {
      configClass = ['custom-warn']
    }
    this.snackBarRef = this.snackBar.open(message, "", {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 2000,
      panelClass: configClass
    });
  }
}
