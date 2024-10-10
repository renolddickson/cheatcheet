import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonMigraterComponent } from './json-migrater.component';

describe('JsonMigraterComponent', () => {
  let component: JsonMigraterComponent;
  let fixture: ComponentFixture<JsonMigraterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonMigraterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonMigraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
