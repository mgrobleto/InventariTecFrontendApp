import { TestBed } from '@angular/core/testing';
    import { Csrf-tokenService } from './csrf-token.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('Csrf-tokenService', () => {
    let service: Csrf-tokenService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Csrf-tokenService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(Csrf-tokenService);
    });

    it('should be created', () => {
            expect(service).toBeTruthy();
        });
        });
