import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerformdialogComponent } from './sellerformdialog.component';

describe('SellerformdialogComponent', () => {
  let component: SellerformdialogComponent;
  let fixture: ComponentFixture<SellerformdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerformdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerformdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
