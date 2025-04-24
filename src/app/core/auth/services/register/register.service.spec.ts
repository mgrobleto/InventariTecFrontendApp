import { TestBed } from '@angular/core/testing';
    import { RegisterService } from './register.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('RegisterService', () => {
    let service: RegisterService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [RegisterService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(RegisterService);
    });

    it('should be created', () => {
            expect(service).toBeTruthy();
        });
        });