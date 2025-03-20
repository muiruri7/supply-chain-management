// src/app/features/dashboard/dashboard-overview/dashboard-overview.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';

interface DashboardData {
  inventoryCount: number;
  ordersPending: number;
  ordersInProgress: number;
  ordersCompleted: number;
  supplierIssues: number;
  userCount: number;
}

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  dashboardData!: DashboardData;
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.error = null;
    // Replace 'dashboard' with your actual API endpoint
    this.apiService.get<DashboardData>('dashboard')
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load dashboard data';
          this.loading = false;
        }
      });
  }
}
