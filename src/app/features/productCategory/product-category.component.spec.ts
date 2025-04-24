import { commonTestsModules } from 'src/test/test-utils';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryComponent } from './product-category.component';

describe('ProductCategoryComponent', () => {
  let component: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({

      declarations: [ProductCategoryComponent]
    ,
  imports: [commonTestsModules]
});
        await TestBed.compileComponents();
fixture = TestBed.createComponent(ProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
