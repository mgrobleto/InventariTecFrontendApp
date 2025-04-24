import { TestBed } from '@angular/core/testing';
    import { SuppliersService } from './suppliers.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('SuppliersService', () => {
    let service: SuppliersService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [SuppliersService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(SuppliersService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});