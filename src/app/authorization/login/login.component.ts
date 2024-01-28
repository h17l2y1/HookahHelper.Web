import {Component} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {TokenService} from "../../services/token.service";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public createLoginForm: FormGroup = this.initLoginUserForm();

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) {}

  public onSave(): void {
    const request: User = this.createLoginForm.value;
    this.authorizationService.login(request).subscribe((token) => {
      this.tokenService.saveToken(token.accessToken);
      this.tokenService.saveRefreshToken(token.refreshToken);
      this.setUserData();
      this.dialogRef.close(true);
    });
  }

  private setUserData(): void {
    const userData = this.tokenService.getUserData();
    if (userData){
      this.roleService.setUserData(userData);
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initLoginUserForm(): FormGroup {
    return this.formBuilder.group({
      email: this.formBuilder.control("test_mail@gmail.com"),
      password: this.formBuilder.control("kHK4*v#f47")
      // email: [null, [Validators.required]],
      // password: [null, [Validators.required]]
    })
  }

}
