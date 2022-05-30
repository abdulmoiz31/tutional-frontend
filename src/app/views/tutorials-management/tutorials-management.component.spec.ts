import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsManagementComponent } from './tutorials-management.component';

describe('TutorialsManagementComponent', () => {
  let component: TutorialsManagementComponent;
  let fixture: ComponentFixture<TutorialsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorialsManagementComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
