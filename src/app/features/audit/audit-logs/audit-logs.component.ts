// src/app/features/audit/audit-logs/audit-logs.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  loading = false;
  error: string | null = null;
  filterForm!: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchLogs();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      user: [''],
      type: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  fetchLogs(): void {
    this.loading = true;
    this.error = null;
    this.apiService.get<AuditLog[]>('audit/logs')
      .subscribe({
        next: data => {
          // Sort logs with most recent first
          this.logs = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          this.filteredLogs = this.logs;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch audit logs.';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    const { user, type, startDate, endDate } = this.filterForm.value;
    this.filteredLogs = this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      let matches = true;
      if (user) {
        matches = matches && log.user.toLowerCase().includes(user.toLowerCase());
      }
      if (type) {
        matches = matches && log.type.toLowerCase().includes(type.toLowerCase());
      }
      if (startDate) {
        matches = matches && logDate >= new Date(startDate);
      }
      if (endDate) {
        matches = matches && logDate <= new Date(endDate);
      }
      return matches;
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filteredLogs = this.logs;
  }

  exportLogs(): void {
    // Optional: Implement CSV/PDF export functionality
    // You could use a library such as FileSaver or jsPDF here
    console.log('Exporting logs:', this.filteredLogs);
  }
}
