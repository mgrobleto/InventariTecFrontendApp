import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { commonTestsModules } from 'src/test/test-utils';

  describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [LoginService],
      imports: [commonTestsModules]
    });
      await TestBed.compileComponents();
      service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
