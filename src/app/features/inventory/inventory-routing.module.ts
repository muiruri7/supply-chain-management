// src/app/features/inventory/inventory-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';

const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: 'new', component: InventoryFormComponent },
  { path: 'edit/:id', component: InventoryFormComponent } // Edit mode route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
