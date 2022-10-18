import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRecluComponent } from './data-reclu.component';

describe('DataRecluComponent', () => {
  let component: DataRecluComponent;
  let fixture: ComponentFixture<DataRecluComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataRecluComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRecluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
