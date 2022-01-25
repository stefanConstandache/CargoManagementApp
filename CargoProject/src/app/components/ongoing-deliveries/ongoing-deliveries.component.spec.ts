import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingDeliveriesComponent } from './ongoing-deliveries.component';

describe('OngoingDeliveriesComponent', () => {
  let component: OngoingDeliveriesComponent;
  let fixture: ComponentFixture<OngoingDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingDeliveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
