import { TestBed } from '@angular/core/testing';
    import { CoreService } from './core.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('CoreService', () => {
    let service: CoreService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [CoreService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(CoreService);
    });

    it('should be created', () => {
            expect(service).toBeTruthy();
        });
        });
