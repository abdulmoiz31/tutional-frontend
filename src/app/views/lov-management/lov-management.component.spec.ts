import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovManagementComponent } from './lov-management.component';

describe('LovManagementComponent', () => {
  let component: LovManagementComponent;
  let fixture: ComponentFixture<LovManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LovManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LovManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
