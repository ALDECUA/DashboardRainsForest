import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltainversionistaComponent } from './altainversionista.component';

describe('AltainversionistaComponent', () => {
  let component: AltainversionistaComponent;
  let fixture: ComponentFixture<AltainversionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltainversionistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltainversionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
