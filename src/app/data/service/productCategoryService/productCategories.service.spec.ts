import { TestBed } from '@angular/core/testing';
import { ProductCategorieService } from './productCategories.service';
import { commonTestsModules } from 'src/test/test-utils';

    describe('ProductCategoriesService', () => {
    let service: ProductCategorieService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [ProductCategorieService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(ProductCategorieService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
