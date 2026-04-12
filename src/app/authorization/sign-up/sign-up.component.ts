import {Component} from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogActions } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AuthService} from "../auth.service";
import {User} from "../../interfaces/entity/user";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

interface Role {
  value: string;
  viewValue: string;
}
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    imports: [MatDialogTitle, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})


export class SignUpComponent {
  public createSignUpForm: FormGroup = this.initCreateUserForm();
  roles: Role[] = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'user', viewValue: 'User'},
  ];

  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthService
  ) {
  }
  public onSave(): void {
    const request: User = this.createSignUpForm.value;
    this.authorizationService.signUp(request).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private initCreateUserForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: ["test_mail@gmail.com", [Validators.required]],
      password: ["kHK4*v#f47", [Validators.required]],
      confirmPassword: ["kHK4*v#f47", [Validators.required]],
      role: ['user', [Validators.required]],
    });
  };
}
