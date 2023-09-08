import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import {AuthorizationService} from "../services/authorization.service";



@NgModule({
  declarations: [
    SignUpComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthorizationService,
  ]
})
export class AuthorizationModule { }
