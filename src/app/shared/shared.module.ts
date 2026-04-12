import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ConfirmationPopupComponent} from './components/confirmation-popup/confirmation-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {NamePipe} from "./pipes/name.pipe";
import {OnlyNumbersPipe} from './pipes/only-numbers.pipe';

@NgModule({ declarations: [
        ConfirmationPopupComponent,
        NamePipe,
        OnlyNumbersPipe
    ],
    exports: [
        ConfirmationPopupComponent
    ], imports: [CommonModule,
        MatInputModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatCardModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SharedModule {
}
