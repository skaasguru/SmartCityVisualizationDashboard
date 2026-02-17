import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  NO_ERRORS_SCHEMA,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  NgtStore,
  extend,
  NgtArgs,
  injectNgtLoader,
  injectBeforeRender,
} from 'angular-three';

extend(THREE);
extend({ OrbitControls });

const FERRARI_MODEL_URL = '/assets/ferrari.glb';
const FERRARI_AO_URL = '/assets/ferrari_ao.png';
const DRACO_DECODER_PATH =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/** Wheel names on the Ferrari model – we rotate these to simulate rolling */
const WHEEL_NAMES = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];

/**
 * Renders the Ferrari model with custom materials and rolling wheels.
 * Materials and shadow are applied when the GLTF is loaded.
 */
@Component({
  selector: 'app-ferrari-model',
  standalone: true,
  imports: [NgtArgs],
  template: `
    @if (carModel) {
      <ngt-primitive *args="[carModel]"></ngt-primitive>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FerrariModelComponent implements OnChanges {
  @Input() gltf: GLTF | null = null;

  /** Root of the car (first child of scene in this GLTF) */
  carModel: THREE.Group | null = null;

  /** Refs to wheel meshes so we can rotate them each frame */
  private wheels: THREE.Object3D[] = [];

  /** Materials we create once and assign to the model */
  private bodyMaterial: THREE.MeshPhysicalMaterial | null = null;
  private detailsMaterial: THREE.MeshStandardMaterial | null = null;
  private glassMaterial: THREE.MeshPhysicalMaterial | null = null;

  constructor() {
    this.createMaterials();

    // Every frame: rotate wheels based on time (car “rolling” forward)
    injectBeforeRender((state) => {
      const time = -state.clock.getElapsedTime();
      for (const wheel of this.wheels) {
        wheel.rotation.x = time * Math.PI * 2;
      }
    });
  }

  private createMaterials(): void {
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });
    this.detailsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
    });
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const gltf = changes['gltf']?.currentValue as GLTF | null;
    if (!gltf?.scene) return;

    const scene = gltf.scene;
    const car = scene.children[0] as THREE.Group;
    if (!car) return;

    // Assign materials by mesh name (same as three.js Ferrari example)
    const body = car.getObjectByName('body');
    if (body && this.bodyMaterial) (body as THREE.Mesh).material = this.bodyMaterial;

    const detailsNames = ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'];
    for (const name of detailsNames) {
      const obj = car.getObjectByName(name);
      if (obj && this.detailsMaterial) (obj as THREE.Mesh).material = this.detailsMaterial;
    }

    const glass = car.getObjectByName('glass');
    if (glass && this.glassMaterial) (glass as THREE.Mesh).material = this.glassMaterial;

    // Collect wheels for rotation
    this.wheels = WHEEL_NAMES.map((name) => car.getObjectByName(name)).filter(
      (o): o is THREE.Object3D => o != null
    );

    // Shadow plane under the car (uses AO texture like the original example)
    const shadowTex = new TextureLoader().load(FERRARI_AO_URL);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
        premultipliedAlpha: true,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    (shadowMesh as THREE.Mesh & { renderOrder?: number }).renderOrder = 2;
    car.add(shadowMesh);

    this.carModel = car;
  }
}

/**
 * Ferrari car scene: model, grid, fog, lights, and orbit/zoom controls.
 */
@Component({
  selector: 'app-ferrari-car-scene',
  standalone: true,
  imports: [NgtArgs, AsyncPipe, FerrariModelComponent],
  template: `
    <ngt-color attach="background" *args="['#333333']"></ngt-color>
    <ngt-fog *args="['#333333', 10, 15]"></ngt-fog>

    <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
    <ngt-directional-light
      [position]="[5, 10, 5]"
      [intensity]="1.5"
    ></ngt-directional-light>

    <!-- Grid on the floor: use *args so NgtArgs gets TemplateRef from ng-template -->
    <ngt-grid-helper
      *args="gridArgs"
      (afterAttach)="onGridAttach($event)"
    ></ngt-grid-helper>

    @if (gltf$ | async; as gltf) {
      @if (gltf?.scene) {
        <app-ferrari-model [gltf]="gltf"></app-ferrari-model>
      }
    }

    @if (camera$ | async; as camera) {
      @if (glDomElement$ | async; as gl) {
        <ngt-orbit-controls
          *args="[camera, gl]"
          [maxDistance]="9"
          [maxPolarAngle]="maxPolarAngle"
          [enableDamping]="true"
        ></ngt-orbit-controls>
      }
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FerrariCarSceneComponent {
  private readonly store = inject(NgtStore);
  readonly camera$ = this.store.select('camera');
  readonly glDomElement$ = this.store.select('gl', 'domElement');

  /** Limit camera so it doesn’t go below the ground (90°) */
  maxPolarAngle = Math.PI / 2;

  /** Arguments for GridHelper: size, divisions, colorCenterLine, colorGrid */
  gridArgs: [number, number, number, number] = [20, 40, 0xffffff, 0xffffff];

  /** Make grid semi-transparent after it’s added to the scene */
  onGridAttach(event: { node: THREE.Object3D }): void {
    const grid = event.node as THREE.GridHelper;
    if (grid.material) {
      const mat = grid.material as THREE.Material;
      mat.opacity = 0.2;
      mat.transparent = true;
      mat.depthWrite = false;
    }
  }

  readonly gltf$ = injectNgtLoader(
    () => GLTFLoader as any,
    FERRARI_MODEL_URL,
    (loader) => {
      const draco = new DRACOLoader();
      draco.setDecoderPath(DRACO_DECODER_PATH);
      (loader as GLTFLoader).setDRACOLoader(draco);
    }
  );
}
