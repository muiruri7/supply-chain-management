// src/app/features/users/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadProfile(): void {
    this.apiService.get<any>('users/profile')
      .subscribe({
        next: data => this.profileForm.patchValue({ username: data.username, email: data.email }),
        error: () => this.errorMessage = 'Failed to load profile data.'
      });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.apiService.put<any>('users/profile', this.profileForm.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.submitting = false;
        },
        error: () => {
          this.errorMessage = 'Failed to update profile.';
          this.submitting = false;
        }
      });
  }
}
