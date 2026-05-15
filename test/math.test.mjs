import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { calculateSpokeLength, calculateWheelBuild, hubHolePositions, lacingMap, rimHolePositions, validateWheelBuild } from '../src/index.js';

const baseHub = { spokeHoleDia: 2.6 };

describe('wheel math', () => {
  test('ports sourced spoke calculator cases', () => {
    const cases = [
      [{ wheel: { erd: 601, spokeCount: 32 }, hub: { ...baseHub, leftFlangeDia: 44, rightFlangeDia: 44, leftFlangeCenter: 22.4, rightFlangeCenter: 35 }, lacing: { leftCross: 3, rightCross: 3 } }, 292.3, 293.6],
      [{ wheel: { erd: 601, spokeCount: 32 }, hub: { ...baseHub, leftFlangeDia: 46, rightFlangeDia: 46, leftFlangeCenter: 33.5, rightFlangeCenter: 16.8 }, lacing: { leftCross: 3, rightCross: 3 } }, 293.1, 291.7],
      [{ wheel: { erd: 600, spokeCount: 32 }, hub: { ...baseHub, leftFlangeDia: 58, rightFlangeDia: 52, leftFlangeCenter: 36.6, rightFlangeCenter: 23.3 }, lacing: { leftCross: 3, rightCross: 3 } }, 291.1, 290.7],
      [{ wheel: { erd: 600, spokeCount: 32 }, hub: { ...baseHub, leftFlangeDia: 58, rightFlangeDia: 52, leftFlangeCenter: 27.4, rightFlangeCenter: 40 }, lacing: { leftCross: 3, rightCross: 3 } }, 290.1, 292.5]
    ];

    cases.forEach(([input, expectedLeft, expectedRight]) => {
      const result = calculateWheelBuild(input);
      assert.equal(result.roundedLeft, expectedLeft);
      assert.equal(result.roundedRight, expectedRight);
    });
  });

  test('uses the standard full spoke angle for crossed spokes', () => {
    const standard = calculateSpokeLength({
      erd: 601,
      flangeDia: 44,
      flangeCenter: 22.4,
      spokeHoleDia: 2.6,
      spokeCount: 32,
      crossPattern: 3,
      lengthAdjustment: 0
    });

    assert.equal(Number(standard.toFixed(1)), 292.3);
  });

  test('creates rim holes, hub holes, and side-aware lacing maps', () => {
    const options = {
      wheel: { spokeCount: 32, erd: 601 },
      hub: { leftFlangeDia: 44, rightFlangeDia: 44 },
      lacing: { leftCross: 3, rightCross: 2 }
    };
    const rim = rimHolePositions(options);
    const hub = hubHolePositions(options);
    const lacing = lacingMap(options);

    assert.equal(rim.length, 32);
    assert.equal(hub.left.length, 16);
    assert.equal(hub.right.length, 16);
    assert.equal(lacing.length, 32);
    assert.equal(lacing.find((spoke) => spoke.side === 'left').rimIndex, 6);
    assert.equal(lacing.find((spoke) => spoke.side === 'right').rimIndex, 5);
  });

  test('radial lacing maps directly outward', () => {
    const lacing = lacingMap({
      wheel: { spokeCount: 24 },
      lacing: { leftCross: 0, rightCross: 0, leftPattern: 'radial', rightPattern: 'radial' }
    });

    assert.equal(lacing[0].rimIndex, 0);
    assert.equal(lacing[1].rimIndex, 2);
    assert.equal(lacing.find((spoke) => spoke.side === 'right').rimIndex, 1);
  });

  test('validates high crosses and rim offset visibility', () => {
    const warnings = validateWheelBuild({
      wheel: { erd: 600, spokeCount: 16, rimOffset: 3 },
      lacing: { leftCross: 4, rightCross: 4 }
    });

    assert.ok(warnings.some((message) => message.includes('left 4x is too high')));
    assert.ok(warnings.some((message) => message.includes('Rim offset is shown')));
  });
});
