import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePathComponent } from './translate-path.component';

describe('TranslatePathComponent', () => {
  let component: TranslatePathComponent;
  let fixture: ComponentFixture<TranslatePathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslatePathComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
