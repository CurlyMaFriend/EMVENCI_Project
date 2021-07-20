import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPersonComponent } from './dialog-edit-person.component';

describe('DialogEditPersonComponent', () => {
  let component: DialogEditPersonComponent;
  let fixture: ComponentFixture<DialogEditPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
