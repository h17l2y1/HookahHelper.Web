import {Component} from '@angular/core';
import {CreateBrand} from "../../interfaces/other/create-brand";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthorizationService} from "../../services/authorization.service";
import {User} from "../../interfaces/entity/user";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})


export class SignUpComponent {
  public createSignUpForm: FormGroup = this.initCreateUserForm();

  constructor(
    public dialogRef: MatDialogRef<SignUpComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService
  ) {
  }
  public onSave(): void {
    const request: User = this.createSignUpForm.value;
    this.authorizationService.createUser(request).subscribe(() => {
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
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  };

}
