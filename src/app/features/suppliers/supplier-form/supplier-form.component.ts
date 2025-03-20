// src/app/features/suppliers/supplier-form/supplier-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {
  supplierForm!: FormGroup;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.supplierId = +idParam;
        this.loadSupplier(this.supplierId);
      }
    });
  }

  initializeForm(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contactInfo: ['', Validators.required],
      performanceRating: [null]  // Optional field
    });
  }

  loadSupplier(id: number): void {
    this.submitting = true;
    this.apiService.get<any>(`suppliers/${id}`)
      .subscribe({
        next: data => {
          this.supplierForm.patchValue({
            name: data.name,
            contactInfo: data.contactInfo,
            performanceRating: data.performanceRating
          });
          this.submitting = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load supplier data.';
          this.submitting = false;
        }
      });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      return;
    }
    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.isEditMode && this.supplierId) {
      // Update supplier
      this.apiService.put<any>(`suppliers/${this.supplierId}`, this.supplierForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Supplier updated successfully!';
            this.submitting = false;
            this.router.navigate(['/suppliers']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while updating the supplier.';
            this.submitting = false;
          }
        });
    } else {
      // Create new supplier
      this.apiService.post<any>('suppliers', this.supplierForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Supplier added successfully!';
            this.submitting = false;
            this.supplierForm.reset();
            this.router.navigate(['/suppliers']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while adding the supplier.';
            this.submitting = false;
          }
        });
    }
  }
}
