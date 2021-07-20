import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Person } from 'src/classTemplates/person';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogEditPersonComponent } from '../dialog-edit-person/dialog-edit-person.component';
import { DialogDeletePersonComponent } from '../dialog-delete-person/dialog-delete-person.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {

  tableData: Person[] = [];
  admin: boolean = false;
  snackBarRef: any;

  displayedColumns: string[] = ['id', 'username', 'name', 'age', 'family', 'role', 'action'];
  dataSource = new MatTableDataSource<Person>(this.tableData);

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('role') === "admin") {
      this.admin = true;
    }
    this.getAllPersons();
  }

  public getAllPersons() {
    let resp = this.authService.persons(localStorage.getItem('token'));
    resp.subscribe((response) => {
      this.dataSource.data = response
    }, (error) => {
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

  openEditPerson(personToEdit: Person) {

    console.log(personToEdit);
    let dialogEdit = this.dialog.open(DialogEditPersonComponent, {
      width: '50rem',
      data: { person: personToEdit }
    });

    dialogEdit.afterClosed().subscribe(result => {
      this.getAllPersons();
    });
  }

  openConfirmDelete(personToDelete: Person) {

    console.log(personToDelete);
    let dialogDelete = this.dialog.open(DialogDeletePersonComponent, {
      width: '25rem',
      data: { person: personToDelete }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.deletePerson(personToDelete);
      }
    });
  }

  applySearch() {
    let searchValue = document.getElementById("searchValue")! as HTMLInputElement;
    this.dataSource.filter = searchValue.value.trim().toLowerCase();
  }

  newPerson() {
    this.router.navigate(['/persons/add']);
  }

  deletePerson(element: Person) {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.authService.deletePerson(element.id, localStorage.getItem('token')).subscribe((response) => {
      this.openSnackBar("Person deleted successfully", "", true);
    }, (error) => {
      if (error.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.openSnackBar("Please login first!", "", false);
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        })
      } else {
        this.openSnackBar("An error occured while trying to delete person!", "", false);
      }
    });
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
