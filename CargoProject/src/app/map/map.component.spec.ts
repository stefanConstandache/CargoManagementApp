import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcGISMapComponent } from './map.component';

describe('MapComponent', () => {
  let component: ArcGISMapComponent;
  let fixture: ComponentFixture<ArcGISMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArcGISMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcGISMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
