// src/app/features/audit/audit.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

@NgModule({
  declarations: [
    AuditLogsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuditRoutingModule
  ]
})
export class AuditModule { }
