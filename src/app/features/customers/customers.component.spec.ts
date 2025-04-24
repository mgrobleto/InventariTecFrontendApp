import { commonTestsModules } from 'src/test/test-utils';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersComponent } from './customers.component';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CustomersComponent],
      imports: [...commonTestsModules]
    });
        await TestBed.compileComponents();
fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
