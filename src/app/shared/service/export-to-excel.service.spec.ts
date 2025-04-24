import { TestBed } from '@angular/core/testing';
    import { ExportToExcelService } from './export-to-excel.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('Export-to-excelService', () => {
    let service: ExportToExcelService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [ExportToExcelService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(ExportToExcelService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});