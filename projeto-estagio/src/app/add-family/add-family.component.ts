import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from 'src/classTemplates/person';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html',
  styleUrls: ['./add-family.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class AddFamilyComponent implements OnInit {

  tableData: Person[] = [];
  formGroup!: FormGroup;
  snackBarRef: any;

  displayedColumns: string[] = ['select', 'id', 'username', 'name'];
  dataSource = new MatTableDataSource<Person>(this.tableData);
  selection = new SelectionModel<Person>(true, []);

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
    this.getAllPersons();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Person): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  public getAllPersons() {
    let resp = this.authService.persons(localStorage.getItem('token'));
    resp.subscribe((response) => {
      console.log(response);
      this.dataSource.data = response
    }, (error) => {
      console.log(error);
      if (error.status === 403) {
        this.openSnackBar("Session Expired! Please try to login first", "", false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        })
      } else {
        alert("Error: " + error.status + ". Please try to login again");
      }
    });
  }

  initForm() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      max_persons: new FormControl('', [Validators.required]),
    });
  }

  goToFamilies() {
    this.router.navigate(['families']);
  }

  showSelected() {
    console.log(this.selection.selected);

    if (this.formGroup.valid) {
      if (this.selection.selected.length > 0) {
        if (this.selection.selected.length > this.formGroup.value.max_persons) {
          this.openSnackBar("Max number of persons smaller than number of persons selected!", "Ok", false);
        } else {
          let personIds: any[] = new Array();
          this.selection.selected.forEach((item) => {
            personIds.push({ id: item.id });
          });
          this.addFamily({
            persons: personIds,
            name: this.formGroup.value.name,
            max_persons: this.formGroup.value.max_persons
          });
        }
      } else {
        this.openSnackBar("Please choose at least one person for the family", "Ok", false);
      }
    } else {
      this.openSnackBar("Please insert the information on 1st step!", "Ok", false);
    }
  }

  addFamily(data: any) {
    console.log(data);
    this.authService.addFamily(data, localStorage.getItem('token')).subscribe((response) => {
      this.openSnackBar("Family inserted successfully!", "Ok", true);
      this.snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigate(['families']);
      });
    }, (error) => {
      if (error.status === 500) {
        this.openSnackBar("Max number of persons smaller than number of persons selected!", "Ok", false);
      } else if (error.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.openSnackBar("Session expired. Please login again!", "Ok", false);
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.openSnackBar("Something went wrong. Please try to login again.", "Ok", false);
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        });
      }
      console.log(error);
    })
  }

  applySearch() {
    let searchValue = document.getElementById("searchValue")! as HTMLInputElement;
    this.dataSource.filter = searchValue.value.trim().toLowerCase();
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
      duration: 2500,
      panelClass: configClass
    });
  }

}
