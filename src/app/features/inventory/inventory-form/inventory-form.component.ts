// src/app/features/inventory/inventory-form/inventory-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm!: FormGroup;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    // Check if we're in edit mode based on the route parameter
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.itemId = +idParam;
        this.loadInventoryItem(this.itemId);
      }
    });
  }

  initializeForm(): void {
    this.inventoryForm = this.fb.group({
      productName: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadInventoryItem(id: number): void {
    this.submitting = true;
    this.apiService.get<any>(`inventory/${id}`)
      .subscribe({
        next: data => {
          // Populate form with fetched data
          this.inventoryForm.patchValue({
            productName: data.productName,
            stock: data.stock
          });
          this.submitting = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load inventory item.';
          this.submitting = false;
        }
      });
  }

  onSubmit(): void {
    if (this.inventoryForm.invalid) {
      return;
    }

    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.isEditMode && this.itemId) {
      // Update existing item
      this.apiService.put<any>(`inventory/${this.itemId}`, this.inventoryForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Inventory updated successfully!';
            this.submitting = false;
            // Optionally navigate back to the inventory list
            this.router.navigate(['/inventory']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while updating inventory.';
            this.submitting = false;
          }
        });
    } else {
      // Create new inventory item
      this.apiService.post<any>('inventory', this.inventoryForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Inventory saved successfully!';
            this.submitting = false;
            this.inventoryForm.reset();
            // Optionally navigate back to the inventory list
            this.router.navigate(['/inventory']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while saving inventory.';
            this.submitting = false;
          }
        });
    }
  }
}
