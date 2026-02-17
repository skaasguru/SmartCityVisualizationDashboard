import { Routes } from '@angular/router';
import { CitySceneComponent } from './components/city-scene/city-scene.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GltfKeyframesComponent } from './components/gltf-keyframes/gltf-keyframes.component';
import { FerrariCarComponent } from './components/ferrari-car/ferrari-car.component';

export const routes: Routes = [
  { path: '', redirectTo: '3d', pathMatch: 'full' },
  { path: '3d', component: CitySceneComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gltf-keyframes', component: GltfKeyframesComponent },
  { path: 'ferrari-car', component: FerrariCarComponent },
];
