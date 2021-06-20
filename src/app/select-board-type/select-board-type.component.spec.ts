import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoardTypeComponent } from './select-board-type.component';

describe('SelectBoardTypeComponent', () => {
  let component: SelectBoardTypeComponent;
  let fixture: ComponentFixture<SelectBoardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBoardTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
