import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PersonsComponent } from './persons/persons.component';
import { FamiliesComponent } from './families/families.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { AddPersonComponent } from './add-person/add-person.component';
import { AddFamilyComponent } from './add-family/add-family.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'persons', pathMatch: 'full' },
      { path: 'persons', component: PersonsComponent },
      { path: 'persons/add', component: AddPersonComponent },
      { path: 'families', component: FamiliesComponent },
      { path: 'families/add', component: AddFamilyComponent },
      { path: 'families/:id', component: FamilyDetailsComponent }
    ],
    canActivate: [AuthGuardGuard]
  },
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
