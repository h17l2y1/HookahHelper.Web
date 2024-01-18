import {Component, Injectable} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthorizationService} from "../authorization.service";
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
    private authorizationService: AuthorizationService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) {}

  public onSave(): void {
    const request: User = this.createLoginForm.value;
    this.authorizationService.login(request).subscribe((token) => {
      this.tokenService.saveToken(token.accessToken);
      this.tokenService.saveRefreshToken(token.refreshToken);
      this.setRole();
      this.dialogRef.close(true);
    });
  }

  private setRole(): void {
    const isAdmin = this.tokenService.isAdmin();
    this.roleService.setAdminRole(isAdmin);
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
