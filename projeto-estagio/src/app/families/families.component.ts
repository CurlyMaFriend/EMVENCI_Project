import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Person } from 'src/classTemplates/person';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Family } from 'src/classTemplates/family';


@Component({
  selector: 'app-families',
  templateUrl: './families.component.html',
  styleUrls: ['./families.component.scss']
})
export class FamiliesComponent implements OnInit {

  tableData: Family[] = [];
  admin: boolean = false;
  snackBarRef: any;

  displayedColumns: string[] = ['id', 'name', 'max_persons', 'action'];
  dataSource = new MatTableDataSource<Family>(this.tableData);

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
    this.getAllFamilies();
  }

  newFamily() {
    this.router.navigate(['/families/add']);
  }

  public getAllFamilies() {
    let resp = this.authService.families(localStorage.getItem('token'));
    resp.subscribe((response) => {
      console.log(response);
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
