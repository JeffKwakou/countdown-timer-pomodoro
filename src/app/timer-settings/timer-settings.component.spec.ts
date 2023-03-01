import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerSettingsComponent } from './timer-settings.component';

describe('TimerSettingsComponent', () => {
  let component: TimerSettingsComponent;
  let fixture: ComponentFixture<TimerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
