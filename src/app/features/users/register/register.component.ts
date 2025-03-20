// src/app/features/users/register/register.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.post<any>('users/register', this.registerForm.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          this.submitting = false;
          this.router.navigate(['/users/login']);
        },
        error: () => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.submitting = false;
        }
      });
  }
}
