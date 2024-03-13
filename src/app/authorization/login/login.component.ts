import {Component} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public createLoginForm: FormGroup = this.initLoginUserForm();
  public hide = true;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthService,
    private tokenService: TokenService) {}

  public fixAutoFill(usr: Event, pwd: string): void {
    const xxx = usr.target as HTMLInputElement;
    const psw = xxx.value;

    if (usr) {
      this.createLoginForm.get('email')?.setValue((usr.target as HTMLInputElement).value);
      // this.createLoginForm.get('email')?.setValue(123);
    }
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
