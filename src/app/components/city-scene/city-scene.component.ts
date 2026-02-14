import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { SceneGraphComponent } from './scene-graph.component';

@Component({
  selector: 'app-city-scene',
  standalone: true,
  template: `
    <ngt-canvas [sceneGraph]="sceneGraph"></ngt-canvas>
  `,
  imports: [NgtCanvas],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
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
  `]
})
export class CitySceneComponent {
  readonly sceneGraph = SceneGraphComponent;
}
