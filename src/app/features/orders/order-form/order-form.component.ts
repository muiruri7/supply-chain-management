// src/app/features/orders/order-form/order-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  orderId: number | null = null;

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
        this.orderId = +idParam;
        this.loadOrder(this.orderId);
      }
    });
  }

  initializeForm(): void {
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      customerName: ['', Validators.required],
      status: ['Pending', Validators.required],
      // Add additional fields such as warehouse assignment, etc.
    });
  }

  loadOrder(id: number): void {
    this.submitting = true;
    this.apiService.get<any>(`orders/${id}`)
      .subscribe({
        next: data => {
          this.orderForm.patchValue({
            orderNumber: data.orderNumber,
            customerName: data.customerName,
            status: data.status
          });
          this.submitting = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load order data.';
          this.submitting = false;
        }
      });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      return;
    }
    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.isEditMode && this.orderId) {
      // Update order
      this.apiService.put<any>(`orders/${this.orderId}`, this.orderForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Order updated successfully!';
            this.submitting = false;
            this.router.navigate(['/orders']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while updating the order.';
            this.submitting = false;
          }
        });
    } else {
      // Create new order
      this.apiService.post<any>('orders', this.orderForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Order created successfully!';
            this.submitting = false;
            this.orderForm.reset();
            this.router.navigate(['/orders']);
          },
          error: () => {
            this.errorMessage = 'An error occurred while creating the order.';
            this.submitting = false;
          }
        });
    }
  }
}
