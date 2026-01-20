import { commonTestsModules } from 'src/test/test-utils';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoicesComponent } from './list-invoices.component';

describe('ListInvoicesComponent', () => {
  let component: ListInvoicesComponent;
  let fixture: ComponentFixture<ListInvoicesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ListInvoicesComponent],
      imports: [...commonTestsModules]
    });
        await TestBed.compileComponents();
fixture = TestBed.createComponent(ListInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

