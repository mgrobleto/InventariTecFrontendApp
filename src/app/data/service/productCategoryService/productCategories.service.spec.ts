import { TestBed } from '@angular/core/testing';

import { ProductCategorieService } from './productCategories.service';

describe('ProductCategorieService', () => {
  let service: ProductCategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
