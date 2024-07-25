import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsTpComponent } from './product-details-tp.component';

describe('ProductDetailsTpComponent', () => {
  let component: ProductDetailsTpComponent;
  let fixture: ComponentFixture<ProductDetailsTpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsTpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsTpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
