import { TestBed } from '@angular/core/testing';
    import { CustomerService } from './customer.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('CustomerService', () => {
    let service: CustomerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [CustomerService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(CustomerService);
    });

    it('should be created', () => {
            expect(service).toBeTruthy();
        });
        });