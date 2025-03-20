// src/app/features/inventory/inventory-list/inventory-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';

interface InventoryItem {
  id: number;
  productName: string;
  stock: number;
  // Add additional fields as needed
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  loading = false;
  error: string | null = null;
  deleteLoading: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.loading = true;
    this.error = null;
    this.apiService.get<InventoryItem[]>('inventory')
      .subscribe({
        next: data => {
          this.inventoryItems = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to fetch inventory data';
          this.loading = false;
        }
      });
  }

  deleteItem(itemId: number): void {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }
    this.deleteLoading[itemId] = true;
    this.apiService.delete(`inventory/${itemId}`)
      .subscribe({
        next: () => {
          // Remove the deleted item from the list
          this.inventoryItems = this.inventoryItems.filter(item => item.id !== itemId);
          this.deleteLoading[itemId] = false;
        },
        error: () => {
          this.error = 'Failed to delete the inventory item.';
          this.deleteLoading[itemId] = false;
        }
      });
  }
}
