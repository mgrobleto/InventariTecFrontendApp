import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";

export const commonTestsModules = [
    HttpClientTestingModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule,
    SharedModule
]