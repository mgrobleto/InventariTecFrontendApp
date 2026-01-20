import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { commonTestsModules } from 'src/test/test-utils';

  describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [commonTestsModules]
    });
    await TestBed.compileComponents();
    service = TestBed.inject(AuthService);
  });

    it('should be created', () => {
      expect(service).toBeTruthy();
    }); 
});
