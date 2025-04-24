import { TestBed } from '@angular/core/testing';
    import { RestorePasswordEmailService } from './restore-password-email.service';
    import { commonTestsModules } from 'src/test/test-utils';

    describe('Restore-password-emailService', () => {
    let service: RestorePasswordEmailService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [RestorePasswordEmailService],
            imports: [commonTestsModules]
        });
        await TestBed.compileComponents();
        service = TestBed.inject(RestorePasswordEmailService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});