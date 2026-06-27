import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {User} from "../../interfaces/entity/user";
import {Router} from "@angular/router";

interface Role {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})


export class SignUpComponent {
  public createSignUpForm: FormGroup = this.initCreateUserForm();
  roles: Role[] = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'user', viewValue: 'User'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authorizationService: AuthService,
    private router: Router
  ) {
  }
  public onSave(): void {
    const request: User = this.createSignUpForm.value;
    this.authorizationService.signUp(request).subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }

  public onCancel(): void {
    void this.router.navigate(['/tobaccos']);
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
