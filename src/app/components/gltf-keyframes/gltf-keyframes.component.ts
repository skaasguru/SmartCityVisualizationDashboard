import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as THREE from 'three';
import { NgtCanvas } from 'angular-three';
import { GltfKeyframesSceneComponent } from './gltf-keyframes-scene.component';

/**
 * Page component: GLTF Keyframes example (Littlest Tokyo).
 * Renders a full-screen Three.js canvas with orbit/zoom controls.
 */
@Component({
  selector: 'app-gltf-keyframes',
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
export class GltfKeyframesComponent {
  readonly sceneGraph = GltfKeyframesSceneComponent;
  readonly cameraConfig = {
    position: new THREE.Vector3(5, 2, 8),
    fov: 40,
  };
}
