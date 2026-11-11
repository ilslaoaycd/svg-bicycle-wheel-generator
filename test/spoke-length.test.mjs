import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import { calculateWheelBuild, maxRimOffset, straightPullDesignedCross } from '../src/index.js';

// Reference builds: DT Swiss spoke calculator and spokecalc.io formulas,
// re-implemented independently from their published client code (2026-11-11).
// Shared with bikearchive.org's spoke calculator, which must agree.
const { builds } = JSON.parse(await readFile(new URL('./fixtures/spoke-reference-builds.json', import.meta.url), 'utf8'));

function toOptions(inputs) {
  return {
    wheel: {
      erd: inputs.erd,
      outerDia: inputs.erd + 33,
      spokeCount: inputs.spokeCount,
      rimOffset: inputs.rimOffset || 0,
      holeStagger: inputs.rimHoleStaggerWidth || 0,
      holeRows: inputs.holeRows || 'same-side'
    },
    hub: {
      hubType: inputs.spokeType === 'straight-pull' ? 'straightpull' : 'jbend',
      leftFlangeDia: inputs.leftFlangeDia,
      rightFlangeDia: inputs.rightFlangeDia,
      leftFlangeCenter: inputs.leftFlangeCenter,
      rightFlangeCenter: inputs.rightFlangeCenter,
      spokeHoleDia: inputs.spokeHoleDia,
      spokeOffsetNds: inputs.spokeOffsetNds,
      spokeOffsetDs: inputs.spokeOffsetDs,
      pairedHoleAngle: inputs.pairedHoleAngle || 0
    },
    lacing: { crossPattern: inputs.crossPattern, lengthAdjustment: inputs.lengthAdjustment || 0 }
  };
}

describe('spoke length matches the reference calculators', () => {
  for (const build of builds) {
    test(build.name, () => {
      const result = calculateWheelBuild(toOptions(build.inputs));
      assert.equal(result.roundedLeft, build.expected.left);
      assert.equal(result.roundedRight, build.expected.right);
    });
  }
});

describe('helpers', () => {
  test('straight pull is laced as DT Swiss assumes', () => {
    assert.equal(straightPullDesignedCross(24, 3), 2);
    assert.equal(straightPullDesignedCross(28, 1), 3);
    assert.equal(straightPullDesignedCross(20, 0), 0);
  });

  test('rim offset limit keeps the holes on the spoke bed', () => {
    assert.equal(maxRimOffset(25), 10.5);
    assert.equal(maxRimOffset(25, 4), 8.5);
    assert.equal(maxRimOffset(3), 0);
  });

  test('bracing angles come back with the lengths', () => {
    const result = calculateWheelBuild(toOptions(builds[0].inputs));
    assert.ok(result.leftBracingAngle > 0 && result.rightBracingAngle > 0);
  });
});
