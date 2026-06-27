import {Component} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {TokenService} from "../../services/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public createLoginForm: FormGroup = this.initLoginUserForm();

  constructor(
    private formBuilder: FormBuilder,
    private authorizationService: AuthService,
    private tokenService: TokenService,
    private router: Router,

  ) {}

  public fixAutoFill(usr: Event, pwd: string): void {
    if (usr) { this.createLoginForm.get('email')?.setValue((usr.target as HTMLInputElement).value) }
    if (pwd) { this.createLoginForm.get('password')?.setValue(pwd) }
  }

  public onSave(): void {
    const request: User = this.createLoginForm.value;
    this.authorizationService.login(request).subscribe((token) => {
      this.tokenService.saveTokens(token);
      void this.router.navigate(['/tobaccos']);
    });
  }

  public onCancel(): void {
    void this.router.navigate(['/tobaccos']);
  }

  private initLoginUserForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

}
