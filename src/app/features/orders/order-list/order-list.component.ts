// src/app/features/orders/order-list/order-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string; // e.g., 'Pending', 'In Progress', 'Completed', etc.
  createdAt: string;
  // Additional fields as needed
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;
  deleteLoading: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.error = null;
    this.apiService.get<Order[]>('orders')
      .subscribe({
        next: (data) => {
          this.orders = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch orders.';
          this.loading = false;
        }
      });
  }

  deleteOrder(orderId: number): void {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }
    this.deleteLoading[orderId] = true;
    this.apiService.delete(`orders/${orderId}`)
      .subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== orderId);
          this.deleteLoading[orderId] = false;
        },
        error: () => {
          this.error = 'Failed to delete the order.';
          this.deleteLoading[orderId] = false;
        }
      });
  }
}
