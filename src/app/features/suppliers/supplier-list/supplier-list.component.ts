// src/app/features/suppliers/supplier-list/supplier-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';

interface Supplier {
  id: number;
  name: string;
  contactInfo: string;
  performanceRating?: number;
  // Additional fields (e.g., pending purchase orders, delivery status) can be added
}

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = false;
  error: string | null = null;
  deleteLoading: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    this.loading = true;
    this.error = null;
    this.apiService.get<Supplier[]>('suppliers')
      .subscribe({
        next: (data) => {
          this.suppliers = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch suppliers.';
          this.loading = false;
        }
      });
  }

  deleteSupplier(supplierId: number): void {
    if (!confirm('Are you sure you want to delete this supplier?')) {
      return;
    }
    this.deleteLoading[supplierId] = true;
    this.apiService.delete(`suppliers/${supplierId}`)
      .subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter(supplier => supplier.id !== supplierId);
          this.deleteLoading[supplierId] = false;
        },
        error: () => {
          this.error = 'Failed to delete the supplier.';
          this.deleteLoading[supplierId] = false;
        }
      });
  }
}
