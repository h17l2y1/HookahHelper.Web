import {Component} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {TokenService} from "../../services/token.service";
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatIcon, MatPrefix, MatInput, MatButton]
})
export class LoginComponent {
  public createLoginForm: FormGroup = this.initLoginUserForm();

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthService,
    private tokenService: TokenService,

  ) {}

  public fixAutoFill(usr: Event, pwd: string): void {
    if (usr) { this.createLoginForm.get('email')?.setValue((usr.target as HTMLInputElement).value) }
    if (pwd) { this.createLoginForm.get('password')?.setValue(pwd) }
  }

  public onSave(): void {
    const request: User = this.createLoginForm.value;
    this.authorizationService.login(request).subscribe((token) => {
      this.tokenService.saveTokens(token);
      this.dialogRef.close(token.accessToken);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initLoginUserForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

}
