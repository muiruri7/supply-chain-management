import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  { 
    path: 'inventory', 
    loadChildren: () => import('./features/inventory/inventory.module').then(m => m.InventoryModule) 
  },
  { 
    path: 'orders', 
    loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) 
  },
  { 
    path: 'suppliers', 
    loadChildren: () => import('./features/suppliers/suppliers.module').then(m => m.SuppliersModule) 
  },
  { 
    path: 'users', 
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) 
  },
  { 
    path: 'notifications', 
    loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule) 
  },
  { 
    path: 'audit', 
    loadChildren: () => import('./features/audit/audit.module').then(m => m.AuditModule) 
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
