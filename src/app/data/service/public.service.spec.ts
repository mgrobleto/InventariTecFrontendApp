import { TestBed } from '@angular/core/testing';
    import { PublicService } from './public.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('PublicService', () => {
    let service: PublicService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [PublicService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(PublicService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});