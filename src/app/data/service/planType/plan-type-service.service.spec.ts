import { TestBed } from '@angular/core/testing';
    import { PlanTypeService } from './plan-type-service.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('Plan-type-serviceService', () => {
    let service: PlanTypeService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [PlanTypeService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(PlanTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
