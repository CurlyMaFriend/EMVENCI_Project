import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeletePersonComponent } from './dialog-delete-person.component';

describe('DialogDeletePersonComponent', () => {
  let component: DialogDeletePersonComponent;
  let fixture: ComponentFixture<DialogDeletePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeletePersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeletePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
