import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportepersonasComponent } from './reportepersonas.component';

describe('ReportepersonasComponent', () => {
  let component: ReportepersonasComponent;
  let fixture: ComponentFixture<ReportepersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportepersonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportepersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
