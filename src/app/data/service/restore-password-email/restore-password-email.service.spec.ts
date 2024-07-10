import { TestBed } from '@angular/core/testing';

import { RestorePasswordEmailService } from './restore-password-email.service';

describe('RestorePasswordEmailService', () => {
  let service: RestorePasswordEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestorePasswordEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
