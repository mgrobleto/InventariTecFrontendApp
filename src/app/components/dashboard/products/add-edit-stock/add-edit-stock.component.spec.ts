import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStockComponent } from './add-edit-stock.component';

describe('AddEditStockComponent', () => {
  let component: AddEditStockComponent;
  let fixture: ComponentFixture<AddEditStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditStockComponent]
    });
    fixture = TestBed.createComponent(AddEditStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
