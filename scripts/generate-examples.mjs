import { mkdir, writeFile } from 'node:fs/promises';
import { renderHubFaceSvg, renderHubSideSvg, renderWheelFaceSvg, renderWheelSideSvg } from '../src/index.js';

await mkdir('examples/svg', { recursive: true });

const rearWheel = {
  wheel: { outerDia: 634, erd: 601, rimWidth: 25, rimOffset: 0, spokeCount: 32, valveType: 'presta' },
  hub: {
    hubPosition: 'rear',
    brakeType: '6bolt',
    hubType: 'jbend',
    showHubHoles: 'visible',
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3
  },
  lacing: { crossPattern: 3 },
  style: { spokeColor: 'color', nippleStyle: 'nipples', nippleColor: 'silver', spokeLayering: '3d' }
};

const frontRadial = {
  wheel: { outerDia: 596, erd: 560, rimWidth: 30, rimOffset: 0, spokeCount: 24, valveType: 'schrader' },
  hub: {
    hubPosition: 'front',
    brakeType: 'centerlock',
    hubType: 'straightpull',
    showHubHoles: 'hidden',
    leftFlangeDia: 42,
    rightFlangeDia: 42,
    leftFlangeCenter: 34,
    rightFlangeCenter: 34
  },
  lacing: { crossPattern: 0 },
  style: { spokeColor: 'silver', nippleStyle: 'nipples', nippleColor: 'black', spokeLayering: '3d' }
};

const examples = {
  'wheel-rear-left-3x.svg': renderWheelFaceSvg({ ...rearWheel, view: { wheelFaceSide: 'left' } }),
  'wheel-rear-drive-hg.svg': renderWheelFaceSvg({ ...rearWheel, view: { wheelFaceSide: 'right' } }),
  'wheel-front-straightpull.svg': renderWheelFaceSvg({ ...frontRadial, view: { wheelFaceSide: 'left' } }),
  'wheel-side-projection.svg': renderWheelSideSvg(rearWheel),
  'wheel-side-cross-section.svg': renderWheelSideSvg({ ...rearWheel, style: { ...rearWheel.style, spokeLayering: 'flat' } }),
  'hub-face-centerlock.svg': renderHubFaceSvg({ ...frontRadial, view: { hubFaceSide: 'left' } }),
  'hub-side-rear.svg': renderHubSideSvg(rearWheel)
};

await Promise.all(Object.entries(examples).map(([file, svg]) => writeFile(`examples/svg/${file}`, `${svg}\n`, 'utf8')));
