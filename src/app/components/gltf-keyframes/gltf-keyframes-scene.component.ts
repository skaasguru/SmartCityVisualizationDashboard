import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  NgtStore,
  extend,
  NgtArgs,
  injectNgtLoader,
  injectBeforeRender,
} from 'angular-three';
import { tap } from 'rxjs';

// Register Three.js classes so we can use them as ngt-* components
extend(THREE);
extend({ OrbitControls });

/** Path to the Littlest Tokyo GLTF model (absolute so loader resolves correctly) */
const MODEL_URL = '/assets/LittlestTokyo.glb';

/** Draco decoder CDN – required for compressed GLTF used by this model */
const DRACO_DECODER_PATH =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/**
 * Scene for the GLTF Keyframes example.
 * Loads Littlest Tokyo with Draco, plays its animation, and provides orbit/zoom controls.
 * Model and mixer are in this component so the scene graph stays in one injector context.
 */
@Component({
  selector: 'app-gltf-keyframes-scene',
  standalone: true,
  imports: [NgtArgs, AsyncPipe],
  template: `
    <!-- Background color (matches original three.js example) -->
    <ngt-color attach="background" *args="['#bfe3dd']"></ngt-color>

    <!-- Lights so the model is visible -->
    <ngt-ambient-light [intensity]="1"></ngt-ambient-light>
    <ngt-directional-light
      [position]="[10, 10, 5]"
      [intensity]="1"
    ></ngt-directional-light>

    <!-- Model: single ngt-group + ngt-primitive so attachment works when created via createComponent -->
    @if (gltf$ | async; as gltf) {
      @if ($any(gltf).scene) {
        <ngt-group [position]="[1, 1, 0]" [scale]="[0.01, 0.01, 0.01]">
          <ngt-primitive *args="[$any(gltf).scene]"></ngt-primitive>
        </ngt-group>
      }
    }

    <!-- OrbitControls: drag to rotate, scroll to zoom -->
    @if (camera$ | async; as camera) {
      @if (glDomElement$ | async; as gl) {
        <ngt-orbit-controls
          *args="[camera, gl]"
          [enablePan]="false"
          [enableDamping]="true"
        ></ngt-orbit-controls>
      }
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class GltfKeyframesSceneComponent {
  private readonly store = inject(NgtStore);
  readonly camera$ = this.store.select('camera');
  readonly glDomElement$ = this.store.select('gl', 'domElement');

  /** Animation mixer for the loaded model; set when gltf$ emits and we have animations */
  private mixer: THREE.AnimationMixer | null = null;

  constructor() {
    injectBeforeRender((state) => {
      if (this.mixer) {
        this.mixer.update(state.delta);
      }
    });
  }

  /** Load GLTF with Draco support (Littlest Tokyo is Draco-compressed) */
  readonly gltf$ = injectNgtLoader(
    () => GLTFLoader as any,
    MODEL_URL,
    (loader) => {
      const draco = new DRACOLoader();
      draco.setDecoderPath(DRACO_DECODER_PATH);
      (loader as GLTFLoader).setDRACOLoader(draco);
    }
  ).pipe(
    tap((gltf: GLTF) => {
      if (gltf?.scene?.animations?.length) {
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        this.mixer.clipAction(gltf.animations[0]).play();
      }
    })
  );
}
