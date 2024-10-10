import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRedoDemoComponent } from './undo-redo-demo.component';

describe('UndoRedoDemoComponent', () => {
  let component: UndoRedoDemoComponent;
  let fixture: ComponentFixture<UndoRedoDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndoRedoDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoRedoDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
