import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  loginProcess() {

    let usernameField = document.getElementById("text-username")! as HTMLInputElement;
    let passwordField = document.getElementById("text-password")! as HTMLInputElement;
    let invalidP = document.getElementById("pInvalid")! as HTMLParagraphElement;

    usernameField.classList.remove('invalid');
    passwordField.classList.remove('invalid');

    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe((response) => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.person_role);
        this.router.navigate(['']);

      }, (error) => {
        if (error.status === 500) {
          invalidP.innerText = "Your password or Username are Incorrect!";
          invalidP.classList.add("invalidP");
        } else {
          invalidP.innerText = "Internal Error please try again!";
          invalidP.classList.add("invalidP");
        }
      }
      )
    } else {

      invalidP.innerText = "All fields are required!";
      invalidP.classList.add("invalidP");

      if (this.formGroup.value.username === "") {
        usernameField.classList.add('invalid');
      }

      if (this.formGroup.value.password === "") {
        passwordField.classList.add('invalid');
      }
    }
  }
}
