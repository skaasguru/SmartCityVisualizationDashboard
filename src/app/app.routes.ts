import { Routes } from '@angular/router';
import { CitySceneComponent } from './components/city-scene/city-scene.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '3d', pathMatch: 'full' },
  { path: '3d', component: CitySceneComponent },
  { path: 'dashboard', component: DashboardComponent }
];
