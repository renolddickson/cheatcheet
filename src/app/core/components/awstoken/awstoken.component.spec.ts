import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwstokenComponent } from './awstoken.component';

describe('AwstokenComponent', () => {
  let component: AwstokenComponent;
  let fixture: ComponentFixture<AwstokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwstokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwstokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
