import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  lacingMap,
  renderHubFaceSvg,
  renderWheelFaceSvg,
  renderWheelSideSvg,
  validateWheelBuild
} from '../src/index.js';

describe('visualizer port behavior', () => {
  test('renders brake, freehub, valve, nipples, and 3d layering classes', () => {
    const svg = renderWheelFaceSvg({
      view: { wheelFaceSide: 'right' },
      wheel: { valveType: 'presta' },
      hub: { hubPosition: 'rear', brakeType: '6bolt', hubType: 'jbend' },
      style: { spokeLayering: '3d', nippleStyle: 'nipples', nippleColor: 'black' }
    });

    assert.match(svg, /hub-brake-mount/);
    assert.match(svg, /hub-cylinder-freehub/);
    assert.match(svg, /wheel-back-spokes/);
    assert.match(svg, /nipple-theme-black/);
    assert.match(svg, /width="6"/);
  });

  test('renders centerlock, straight-pull, and schrader variants', () => {
    const face = renderWheelFaceSvg({
      wheel: { valveType: 'schrader', spokeCount: 24 },
      hub: { hubPosition: 'front', brakeType: 'centerlock', hubType: 'straightpull' },
      lacing: { crossPattern: 0 },
      style: { spokeColor: 'silver' }
    });
    const hub = renderHubFaceSvg({
      view: { hubFaceSide: 'left' },
      hub: { brakeType: 'centerlock', hubType: 'straightpull' }
    });

    assert.match(face, /hub-flange-left/);
    assert.match(face, /hub-centerlock-dashed-ring/);
    assert.match(face, /stroke-dasharray="1 1"/);
    assert.match(face, /width="8"/);
    assert.match(hub, /hub-centerlock-solid-ring/);
    assert.match(hub, /hub-centerlock-dashed-ring/);
  });

  test('renders marker valve text and flat side cross-section', () => {
    const face = renderWheelFaceSvg({ wheel: { valveType: 'marker' } });
    const side = renderWheelSideSvg({ style: { spokeLayering: 'flat' } });

    assert.match(face, />VALVE<\/text>/);
    assert.doesNotMatch(side, /wheel-back-spokes/);
    assert.match(side, /spoke-left/);
    assert.match(side, /rim-body/);
  });

  test('lacing follows the downloaded visualizer pattern shift for even crosses', () => {
    const threeCross = lacingMap({ wheel: { spokeCount: 32 }, lacing: { crossPattern: 3 } });
    const twoCross = lacingMap({ wheel: { spokeCount: 32 }, lacing: { crossPattern: 2 } });

    assert.equal(threeCross[0].rimIndex, 6);
    assert.equal(threeCross.find((spoke) => spoke.side === 'right').rimIndex, 7);
    assert.equal(twoCross[0].patternShift, 2);
    assert.equal(twoCross[0].rimIndex, 6);
    assert.equal(twoCross.find((spoke) => spoke.side === 'right').rimIndex, 7);
  });

  test('validation catches impossible dimensions', () => {
    const warnings = validateWheelBuild({
      wheel: { outerDia: 600, erd: 601, spokeCount: 15 },
      lacing: { crossPattern: 4 }
    });

    assert.ok(warnings.some((message) => message.includes('even number')));
    assert.ok(warnings.some((message) => message.includes('ERD must be smaller')));
  });
});
