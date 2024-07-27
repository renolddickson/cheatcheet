import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyvpTranslateComponent } from './recentlyvp-translate.component';

describe('RecentlyvpTranslateComponent', () => {
  let component: RecentlyvpTranslateComponent;
  let fixture: ComponentFixture<RecentlyvpTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyvpTranslateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyvpTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
