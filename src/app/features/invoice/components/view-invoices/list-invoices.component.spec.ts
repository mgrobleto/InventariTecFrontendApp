import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoicesComponent } from './list-invoices.component';

describe('ListInvoicesComponent', () => {
  let component: ListInvoicesComponent;
  let fixture: ComponentFixture<ListInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInvoicesComponent]
    });
    fixture = TestBed.createComponent(ListInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
