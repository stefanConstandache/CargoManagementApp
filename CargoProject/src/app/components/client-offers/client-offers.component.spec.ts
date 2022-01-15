import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOffersComponent } from './client-offers.component';

describe('ClientOffersComponent', () => {
  let component: ClientOffersComponent;
  let fixture: ComponentFixture<ClientOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
