import {Component, Injectable} from '@angular/core';
import {User} from "../../interfaces/entity/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthorizationService} from "../../services/authorization.service";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public createLoginForm: FormGroup = this.initLoginUserForm();

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService
  ) {
  }

  public onSave(): void {
    const request: User = this.createLoginForm.value;
    this.authorizationService.authorization(request).subscribe((token) => {
      localStorage.setItem('access_token', token.token);

      const tokenPayload = JSON.parse(atob(token.token.split('.')[1]));
      let role = tokenPayload.role;
      localStorage.setItem('role', role);
      this.dialogRef.close(true);
    });
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

  // saveToken(token: string): void {
  //   localStorage.setItem('access_token', token);
  // }
}
