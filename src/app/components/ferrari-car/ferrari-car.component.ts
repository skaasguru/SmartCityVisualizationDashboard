import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as THREE from 'three';
import { NgtCanvas } from 'angular-three';
import { FerrariCarSceneComponent } from './ferrari-car-scene.component';

/**
 * Page component: Ferrari car example with rolling wheels.
 * Full-screen canvas with orbit/zoom; car materials and wheel animation in the scene.
 */
@Component({
  selector: 'app-ferrari-car',
  standalone: true,
  imports: [NgtCanvas],
  template: `
    <ngt-canvas
      [sceneGraph]="sceneGraph"
      [camera]="cameraConfig"
    ></ngt-canvas>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      ngt-canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class FerrariCarComponent {
  readonly sceneGraph = FerrariCarSceneComponent;
  readonly cameraConfig = {
    position: new THREE.Vector3(4.25, 1.4, -4.5),
    fov: 40,
  };
}
