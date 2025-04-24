import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency-service.service';
import { commonTestsModules } from 'src/test/test-utils';

    describe('Currency-serviceService', () => {
    let service: CurrencyService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [CurrencyService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(CurrencyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});