import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NgtStore, extend, NgtArgs } from 'angular-three';

// Register Three.js elements
extend(THREE);
extend({ OrbitControls });

/**
 * REFINED VEHICLE: Using a reliable animation pattern via (beforeRender)
 */
@Component({
  selector: 'app-moving-vehicle',
  standalone: true,
  imports: [NgtArgs],
  template: `
    <ngt-mesh (beforeRender)="onBeforeRender($any($event))">
      <ngt-box-geometry *args="[0.4, 0.25, 0.7]"></ngt-box-geometry>
      <ngt-mesh-standard-material [color]="color" [emissive]="color" [emissiveIntensity]="5"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MovingVehicleComponent {
  @Input() color = '#00f2fe';
  @Input() axis: 'x' | 'z' = 'x';
  @Input() offset = 0;

  onBeforeRender(event: { state: any, object: THREE.Object3D }) {
    const { state, object } = event;
    const t = (state.clock.getElapsedTime() + (Math.abs(this.offset) * 0.5)) * 4;
    const pos = ((t) % 40) - 20;

    if (this.axis === 'x') {
      object.position.set(pos, 0.15, this.offset);
    } else {
      object.position.set(this.offset, 0.15, pos);
    }
  }
}

/**
 * BUILDING COMPONENT: Steel and Concrete Industrial Look
 */
@Component({
  selector: 'app-building',
  standalone: true,
  imports: [NgtArgs, CommonModule],
  template: `
    <ngt-group [position]="position">
      <!-- Main Structure (Industrial Steel Grey - Higher Visibility) -->
      <ngt-mesh [position]="[0, height/2, 0]">
        <ngt-box-geometry *args="[width, height, depth]"></ngt-box-geometry>
        <ngt-mesh-standard-material color="#5d6d7e" [roughness]="0.3" [metalness]="0.4"></ngt-mesh-standard-material>
      </ngt-mesh>

      <!-- Windows (Emissive Floors) -->
      @for (f of floorPositions; track $index) {
        <ngt-mesh [position]="[0, f, 0]">
          <ngt-box-geometry *args="[width + 0.08, 0.15, depth + 0.08]"></ngt-box-geometry>
          <ngt-mesh-standard-material [color]="accentColor" [emissive]="accentColor" [emissiveIntensity]="3"></ngt-mesh-standard-material>
        </ngt-mesh>
      }

      <!-- Detailed Base (Polished Grey Concrete) -->
      <ngt-mesh [position]="[0, 0.4, 0]">
        <ngt-box-geometry *args="[width + 0.25, 0.8, depth + 0.25]"></ngt-box-geometry>
        <ngt-mesh-standard-material color="#aeb6bf" [roughness]="0.8"></ngt-mesh-standard-material>
      </ngt-mesh>

      <!-- Roof Tech Unit -->
      <ngt-mesh [position]="[0, height + 0.2, 0]">
        <ngt-box-geometry *args="[width * 0.5, 0.4, depth * 0.5]"></ngt-box-geometry>
        <ngt-mesh-standard-material color="#34495e"></ngt-mesh-standard-material>
      </ngt-mesh>
    </ngt-group>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuildingComponent {
  @Input() position: [number, number, number] = [0, 0, 0];
  @Input() height = 5;
  @Input() width = 2;
  @Input() depth = 2;
  @Input() accentColor = '#00f2fe';

  get floorPositions() {
    const list = [];
    for (let i = 1.2; i < this.height; i += 1.8) {
      list.push(i);
    }
    return list;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, BuildingComponent, MovingVehicleComponent, NgtArgs],
  template: `
    <ngt-color attach="background" *args="['#1a1d21']"></ngt-color>
    <ngt-fog *args="['#1a1d21', 20, 100]"></ngt-fog>

    <!-- Stronger Global Industrial Lighting -->
    <ngt-ambient-light [intensity]="1.2"></ngt-ambient-light>
    <ngt-directional-light [position]="[40, 60, 30]" [intensity]="1.8"></ngt-directional-light>
    <ngt-point-light [position]="[0, 25, 0]" [intensity]="4" color="#ffffff"></ngt-point-light>

    <ngt-group>
      <!-- GROUND: Infrastructure -->
      <ngt-mesh [rotation]="[-1.57, 0, 0]" [position]="[0, -0.01, 0]">
        <ngt-plane-geometry *args="[100, 100]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="#111" [roughness]="1"></ngt-mesh-standard-material>
      </ngt-mesh>

      <!-- Roads -->
      <ngt-mesh [rotation]="[-1.57, 0, 0]" [position]="[0, 0, 0]">
        <ngt-plane-geometry *args="[100, 7.5]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="#222"></ngt-mesh-standard-material>
      </ngt-mesh>
      <ngt-mesh [rotation]="[-1.57, 0, 1.57]" [position]="[0, 0, 0]">
        <ngt-plane-geometry *args="[100, 7.5]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="#222"></ngt-mesh-standard-material>
      </ngt-mesh>

      <!-- Yellow Lane Markers -->
      @for (m of roadMarkers; track $index) {
        <ngt-mesh [rotation]="[-1.57, 0, 0]" [position]="[m, 0.05, 0]">
          <ngt-plane-geometry *args="[2.5, 0.4]"></ngt-plane-geometry>
          <ngt-mesh-standard-material color="#f4d03f"></ngt-mesh-standard-material>
        </ngt-mesh>
        <ngt-mesh [rotation]="[-1.57, 0, 1.57]" [position]="[0, 0.05, m]">
          <ngt-plane-geometry *args="[2.5, 0.4]"></ngt-plane-geometry>
          <ngt-mesh-standard-material color="#f4d03f"></ngt-mesh-standard-material>
        </ngt-mesh>
      }

      <!-- Silver Street Lights -->
      @for (l of lights; track $index) {
        <ngt-group [position]="[l.x, 0, l.z]">
          <ngt-mesh [position]="[0, 2.5, 0]">
            <ngt-cylinder-geometry *args="[0.1, 0.1, 5]"></ngt-cylinder-geometry>
            <ngt-mesh-standard-material color="#ecf0f1" [metalness]="1" [roughness]="0.1"></ngt-mesh-standard-material>
          </ngt-mesh>
          <ngt-mesh [position]="[0, 5, 0.5]">
            <ngt-box-geometry *args="[0.5, 0.2, 1]"></ngt-box-geometry>
            <ngt-mesh-standard-material color="#ecf0f1" [metalness]="1"></ngt-mesh-standard-material>
          </ngt-mesh>
          <ngt-point-light [position]="[0, 4.8, 1]" [intensity]="1.5" color="#ffaa00" [distance]="25"></ngt-point-light>
        </ngt-group>
      }

      <!-- Dynamic Traffic (Fixed Component Tags) -->
      <app-moving-vehicle [color]="'#00f2fe'" [axis]="'x'" [offset]="2.2"></app-moving-vehicle>
      <app-moving-vehicle [color]="'#f093fb'" [axis]="'x'" [offset]="-2.2"></app-moving-vehicle>
      <app-moving-vehicle [color]="'#ffffff'" [axis]="'z'" [offset]="2.2"></app-moving-vehicle>
      <app-moving-vehicle [color]="'#4facfe'" [axis]="'z'" [offset]="-2.2"></app-moving-vehicle>

      <!-- Skyscrapers (Industrial Slate Grey) -->
      @for (b of buildings; track $index) {
        <app-building 
          [position]="[b.x, 0, b.z]" 
          [height]="b.h" 
          [width]="b.w" 
          [depth]="b.d"
          [accentColor]="b.color"
        ></app-building>
      }
    </ngt-group>

    @if (camera$ | async; as camera) {
      @if (glDomElement$ | async; as gl) {
        <ngt-orbit-controls *args="[camera, gl]" [enableDamping]="true"></ngt-orbit-controls>
      }
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SceneGraphComponent {
  private readonly store = inject(NgtStore);
  readonly camera$ = this.store.select('camera');
  readonly glDomElement$ = this.store.select('gl', 'domElement');

  buildings: any[] = [];
  lights: any[] = [];
  roadMarkers: number[] = [];

  constructor() {
    this.createCityLayout();
  }

  private createCityLayout() {
    const accents = ['#3498db', '#9b59b6', '#1abc9c'];
    for (let i = -45; i <= 45; i += 10) { if (Math.abs(i) > 5) this.roadMarkers.push(i); }
    for (let i = -40; i <= 40; i += 20) {
      this.lights.push({ x: i, z: 6 });
      this.lights.push({ x: 6, z: i });
    }
    for (let i = 0; i < 70; i++) {
      const x = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 25);
      const z = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 25);
      const h = 5 + Math.pow(Math.random(), 2) * 20;
      const w = 3 + Math.random() * 1.5;
      this.buildings.push({ x, z, h, w, d: w, color: accents[Math.floor(Math.random() * accents.length)] });
    }
  }
}
