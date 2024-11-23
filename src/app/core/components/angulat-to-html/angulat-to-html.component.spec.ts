import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngulatToHtmlComponent } from './angulat-to-html.component';

describe('AngulatToHtmlComponent', () => {
  let component: AngulatToHtmlComponent;
  let fixture: ComponentFixture<AngulatToHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngulatToHtmlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngulatToHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
