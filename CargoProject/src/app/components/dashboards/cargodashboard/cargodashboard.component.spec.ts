import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargodashboardComponent } from './cargodashboard.component';

describe('CargodashboardComponent', () => {
  let component: CargodashboardComponent;
  let fixture: ComponentFixture<CargodashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargodashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargodashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
