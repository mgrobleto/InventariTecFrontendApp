import { TestBed } from '@angular/core/testing';

import { PlanTypeServiceService } from './plan-type-service.service';

describe('PlanTypeServiceService', () => {
  let service: PlanTypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanTypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
