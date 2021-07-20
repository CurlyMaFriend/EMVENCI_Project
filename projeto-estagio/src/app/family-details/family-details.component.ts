import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Family } from 'src/classTemplates/family';
import { Person } from 'src/classTemplates/person';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {

  family!: Family;
  snackBarRef: any;
  tableData: Person[] = [];
  id!: number;
  displayedColumns: string[] = ['id', 'username', 'name', 'age', 'family', 'role'];
  dataSource = new MatTableDataSource<Person>(this.tableData);

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.id = params.id);
  }

  ngOnInit(): void {
    this.getFamily(this.id);
  }

  getFamily(id: any) {
    let resp = this.authService.family(this.id, localStorage.getItem('token'));
    resp.subscribe((response) => {
      console.log(response);
      if (typeof response.persons === 'undefined') {
        console.log("entrou");
        this.dataSource = new MatTableDataSource<Person>(this.tableData);
      } else {
        this.dataSource.data = response.persons;
      }
      this.family = response;
    }, (error) => {
      if (error.status === 403) {
        this.openSnackBar("Session Expired! Please try to login first", "", false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        })
      } else if (error.status === 500) {
        this.router.navigate(['families']);
      } else {
        this.openSnackBar("Error: " + error.status + ". Please try to login again", "", false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['login']);
        })
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
