import { commonTestsModules } from 'src/test/test-utils';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePasswordPrivatePageComponent } from './restore-password-private-page.component';

describe('RestorePasswordPrivatePageComponent', () => {
  let component: RestorePasswordPrivatePageComponent;
  let fixture: ComponentFixture<RestorePasswordPrivatePageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({

      declarations: [RestorePasswordPrivatePageComponent]
    ,
  imports: [commonTestsModules]
});
        await TestBed.compileComponents();
fixture = TestBed.createComponent(RestorePasswordPrivatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

