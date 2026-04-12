import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {User} from "../../interfaces/entity/user";

interface Role {
  value: string;
  viewValue: string;
}
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false
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
