import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import {
  BicycleWheelSVG,
  HUB_PRESETS,
  HubSVGGenerator,
  WheelFaceSVGGenerator,
  WheelSideSVGGenerator,
  calculateSpokeLength,
  calculateWheelBuild,
  lacingMap,
  normalizeFreehubType,
  normalizeOptions,
  renderHubFaceSvg,
  renderHubSideSvg,
  renderWheelFaceSvg,
  renderWheelSideSvg,
  renderWheelSvg
} from '../src/index.js';

describe('public API', () => {
  test('exports facade, render functions, classes, and math helpers', () => {
    assert.equal(typeof BicycleWheelSVG, 'function');
    assert.equal(typeof HubSVGGenerator, 'function');
    assert.equal(typeof WheelFaceSVGGenerator, 'function');
    assert.equal(typeof WheelSideSVGGenerator, 'function');
    assert.equal(typeof HUB_PRESETS, 'object');
    assert.equal(typeof renderWheelSvg, 'function');
    assert.equal(typeof renderWheelFaceSvg, 'function');
    assert.equal(typeof renderWheelSideSvg, 'function');
    assert.equal(typeof renderHubFaceSvg, 'function');
    assert.equal(typeof renderHubSideSvg, 'function');
    assert.equal(typeof calculateSpokeLength, 'function');
    assert.equal(typeof calculateWheelBuild, 'function');
    assert.equal(typeof lacingMap, 'function');
    assert.equal(typeof normalizeFreehubType, 'function');
    assert.equal(typeof normalizeOptions, 'function');
  });

  test('facade renders every view as SVG strings', () => {
    const generator = new BicycleWheelSVG();

    assert.match(generator.wheel(), /^<svg /);
    assert.match(generator.wheelFace({ view: { wheelFaceSide: 'right' } }), /^<svg /);
    assert.match(generator.wheelSide(), /^<svg /);
    assert.match(generator.hubFace(), /^<svg /);
    assert.match(generator.hubSide(), /^<svg /);
    assert.equal(generator.spokeBuild().roundedLeft, 291.6);
  });

  test('rendered SVG output rounds generated decimals to three places', () => {
    const samples = [
      renderWheelFaceSvg({ hub: { brakeType: '6bolt' }, view: { wheelFaceSide: 'left' } }),
      renderWheelSideSvg(),
      renderHubFaceSvg({ hub: { brakeType: '6bolt' }, view: { hubFaceSide: 'left' } }),
      renderHubSideSvg({ hub: { preset: 'dt-swiss-240-exp-boost-rear-centerlock' } })
    ];

    samples.forEach((svg) => {
      assert.doesNotMatch(svg, /-?(?:\d+\.\d{4,}|\.\d{4,})(?:e[+-]?\d+)?/i);
    });
  });

  test('CommonJS bundle can be required', () => {
    const require = createRequire(import.meta.url);
    const api = require('../dist/index.cjs');

    assert.equal(typeof api.renderWheelFaceSvg, 'function');
    assert.match(api.renderHubSideSvg(), /^<svg /);
  });

  test('runtime source avoids Node and DOM globals', async () => {
    const files = [
      'src/index.js',
      'src/math.js',
      'src/paths.js',
      'src/svg.js',
      'src/wheelFaceSvgGenerator.js',
      'src/wheelSideSvgGenerator.js',
      'src/hubSvgGenerator.js'
    ];
    const forbidden = /(?:from ['"]node:|require\(|module\.exports|process\.|document\.|window\.)/;

    await Promise.all(files.map(async (file) => {
      const content = await readFile(file, 'utf8');
      assert.equal(forbidden.test(content), false, `${file} includes a forbidden runtime global`);
    }));
  });

  test('generated examples include expected visualizer groups', async () => {
    const face = await readFile('examples/svg/wheel-rear-drive-hg.svg', 'utf8');
    const side = await readFile('examples/svg/wheel-side-projection.svg', 'utf8');
    const hub = await readFile('examples/svg/hub-dt-swiss-240-exp-boost-rear-centerlock-face-left.svg', 'utf8');

    assert.match(face, /hub-cylinder-freehub/);
    assert.match(face, /wheel-front-spokes/);
    assert.match(side, /hub-side-group/);
    assert.match(hub, /hub-brake-mount/);
  });

  test('hub presets merge before explicit hub overrides', () => {
    const config = normalizeOptions({
      hub: {
        preset: 'industry-nine-hydra2-boost-rear-6bolt',
        leftFlangeDia: 61
      }
    });

    assert.equal(config.hub.name, 'Industry Nine Hydra2 Classic 12x148 Rear 6-Bolt');
    assert.equal(config.hub.brandStyle, 'industry-nine');
    assert.equal(config.hub.builtInDimension, 148);
    assert.equal(config.hub.leftFlangeDia, 61);
    assert.equal(config.hub.rightFlangeDia, 62);
  });

  test('hub side rendering uses built-in dimension and blueprint detail classes', () => {
    const svg = renderHubSideSvg({
      wheel: { spokeCount: 28 },
      hub: { preset: 'industry-nine-solix-road-rear-centerlock' }
    });

    assert.match(svg, /data-hub-preset="industry-nine-solix-road-rear-centerlock"/);
    assert.match(svg, /hub-brand-industry-nine/);
    assert.match(svg, /hub-freehub-xd/);
    assert.match(svg, /hub-centerlock-side/);
    assert.match(svg, /hub-blueprint-line/);
  });

  test('hub face rendering exposes DT Swiss realism details', () => {
    const svg = renderHubFaceSvg({
      hub: { preset: 'dt-swiss-240-exp-boost-rear-centerlock' },
      view: { hubFaceSide: 'left' }
    });

    assert.match(svg, /hub-brand-dt-swiss/);
    assert.match(svg, /<circle[^>]+r="17"[^>]+class="hub-centerlock-solid-ring"/);
    assert.match(svg, /<circle[^>]+r="17.5"[^>]+class="hub-centerlock-dashed-ring"[^>]+stroke-dasharray="1 1"/);
    assert.doesNotMatch(svg, /hub-face-reference/);
    assert.doesNotMatch(svg, /hub-bearing-ring-face/);
    assert.doesNotMatch(svg, /hub-centerlock-lockring/);
    assert.doesNotMatch(svg, /class="hub-brake-mount"/);
    assert.match(svg, /hub-flange-cutout/);
  });

  test('wheel face uses current hub face brake mount logic', () => {
    const centerlock = renderWheelFaceSvg({
      view: { wheelFaceSide: 'left' },
      hub: { brakeType: 'centerlock', hubPosition: 'front' }
    });
    const sixBolt = renderWheelFaceSvg({
      view: { wheelFaceSide: 'left' },
      hub: { brakeType: '6bolt', hubPosition: 'front' }
    });

    assert.match(centerlock, /hub-centerlock-solid-ring/);
    assert.match(centerlock, /hub-centerlock-dashed-ring/);
    assert.doesNotMatch(centerlock, /class="hub-brake-mount"/);
    assert.match(sixBolt, /class="hub-brake-mount"/);
    assert.doesNotMatch(sixBolt, /hub-centerlock-dashed-ring/);
  });

  test('right hub face freehub varies between HG, Microspline, and XD', () => {
    const hg = renderHubFaceSvg({ view: { hubFaceSide: 'right' }, hub: { hubPosition: 'rear', freehubType: 'hg' } });
    const microspline = renderHubFaceSvg({ view: { hubFaceSide: 'right' }, hub: { hubPosition: 'rear', freehubType: 'microspline' } });
    const xd = renderHubFaceSvg({ view: { hubFaceSide: 'right' }, hub: { hubPosition: 'rear', freehubType: 'xd' } });

    assert.match(hg, /hub-freehub-hg-face/);
    assert.match(microspline, /hub-freehub-microspline-face/);
    assert.match(xd, /hub-freehub-xd-face/);
    assert.match(xd, /hub-freehub-xd-middle-ring/);
    assert.match(xd, /hub-freehub-xd-center-ring/);
    assert.ok((microspline.match(/L /g) || []).length > (hg.match(/L /g) || []).length);
  });

  test('hub side supports realistic grey and black render mode', () => {
    const svg = renderHubSideSvg({
      hub: { preset: 'dt-swiss-350-mtb-boost-rear-6bolt' },
      style: { hubRenderStyle: 'realistic' }
    });

    assert.match(svg, /hub-render-realistic/);
    assert.match(svg, /fill="#c9cdd0"/);
    assert.match(svg, /stroke="#111111"/);
  });

  test('j-bend side views omit side-visible flange spoke holes', () => {
    const svg = renderHubSideSvg({
      hub: { preset: 'industry-nine-hydra2-boost-rear-6bolt', hubType: 'jbend' }
    });

    assert.doesNotMatch(svg, /class="hub-spoke-hole-side"/);
    assert.doesNotMatch(svg, /class="hub-bolt-head-side"/);
  });

  test('rim brake hubs force brake mount width to zero and omit side brake mount', () => {
    const config = normalizeOptions({
      hub: { brakeType: 'rim', brakeMountWidth: 12 }
    });
    const svg = renderHubSideSvg({
      hub: { brakeType: 'rim', brakeMountWidth: 12 }
    });

    assert.equal(config.hub.brakeMountWidth, 0);
    assert.doesNotMatch(svg, /class="hub-brake-mount/);
  });

  test('disc brake mount defaults to five millimeters', () => {
    assert.equal(normalizeOptions({ hub: { brakeType: '6bolt' } }).hub.brakeMountWidth, 5);
    assert.equal(normalizeOptions({ hub: { brakeType: 'centerlock' } }).hub.brakeMountWidth, 5);
  });

  test('freehub type names normalize to XD, HG, and Microspline options', () => {
    assert.equal(normalizeFreehubType('xdr'), 'xd');
    assert.equal(normalizeFreehubType('xd-xdr'), 'xd');
    assert.equal(normalizeFreehubType('road-hg'), 'hg');
    assert.equal(normalizeFreehubType('microspline'), 'microspline');
    assert.equal(normalizeOptions({ hub: { freehubType: 'xdr' } }).hub.freehubType, 'xd');
  });

  test('XD freehub side detail is short splines, short threads, then smooth body', () => {
    const svg = renderHubSideSvg({
      hub: {
        freehubType: 'xd',
        freehubLength: 37,
        freehubDia: 34
      }
    });
    const firstSpline = svg.match(/<line x1="([^"]+)" y1="[^"]+" x2="([^"]+)"[^>]+class="hub-freehub-spline"/);
    const firstThread = svg.match(/<line x1="([^"]+)" y1="[^"]+" x2="\1"[^>]+class="hub-freehub-thread-line"/);

    assert.match(svg, /hub-freehub-xd/);
    assert.ok(firstSpline, 'expected XD spline detail');
    assert.ok(firstThread, 'expected XD thread detail');
    assert.ok(Number(firstSpline[2]) - Number(firstSpline[1]) <= 7.2);
    assert.match(svg, /d="[^"]* 58[^"]* 59[^"]* 60[^"]* 61[^"]*" class="hub-cylinder-freehub hub-freehub-xd/);
    assert.match(svg, /class="hub-freehub-final-step-line"/);
  });

  test('HG freehub side uses half as many spline lines as Microspline', () => {
    const hg = renderHubSideSvg({ hub: { freehubType: 'hg', freehubDia: 34 } });
    const microspline = renderHubSideSvg({ hub: { freehubType: 'microspline', freehubDia: 34 } });
    const hgCount = (hg.match(/class="hub-freehub-spline"/g) || []).length;
    const microsplineCount = (microspline.match(/class="hub-freehub-spline"/g) || []).length;

    assert.ok(hgCount > 0);
    assert.ok(microsplineCount > hgCount);
    assert.ok(hgCount <= Math.ceil(microsplineCount / 2));
  });

  test('freehub, six-bolt, and straight-pull side detail lines are centered in parent bounds', () => {
    const hg = renderHubSideSvg({ hub: { freehubType: 'hg', freehubDia: 34 } });
    const sixBolt = renderHubSideSvg({ hub: { brakeType: '6bolt' } });
    const straightPull = renderHubSideSvg({
      wheel: { spokeCount: 28 },
      hub: { hubType: 'straightpull', leftFlangeDia: 56, rightFlangeDia: 56 }
    });
    const hgY = [...hg.matchAll(/y1="([^"]+)" x2="[^"]+" y2="\1" class="hub-freehub-spline"/g)].map((match) => Number(match[1]));
    const sixBoltY = [...sixBolt.matchAll(/y1="([^"]+)" x2="[^"]+" y2="\1" class="hub-sixbolt-side-line"/g)].map((match) => Number(match[1]));
    const slotY = [...straightPull.matchAll(/y1="([^"]+)" x2="[^"]+" y2="\1" class="hub-straightpull-slot-side"/g)].map((match) => Number(match[1]));

    assert.deepEqual(hgY, [64.8, 71.6, 78.4, 85.2]);
    assert.deepEqual(sixBoltY, [69, 81]);
    assert.equal(Number((slotY[0] + slotY.at(-1)).toFixed(6)), 150);
  });

  test('straight-pull side flanges use slots instead of side hole dots', () => {
    const svg = renderHubSideSvg({
      wheel: { spokeCount: 28 },
      hub: { hubType: 'straightpull' }
    });
    const slotCount = (svg.match(/class="hub-straightpull-slot-side"/g) || []).length;

    assert.doesNotMatch(svg, /class="hub-spoke-hole-side"/);
    assert.equal(slotCount, 14);
  });

  test('six-bolt side mount uses centerlock body shape with horizontal line detail', () => {
    const svg = renderHubSideSvg({
      hub: { brakeType: '6bolt' }
    });

    assert.match(svg, /class="hub-brake-mount hub-6bolt-side"/);
    assert.match(svg, /class="hub-sixbolt-side-line"/);
    assert.doesNotMatch(svg, /class="hub-centerlock-tooth"/);
    assert.doesNotMatch(svg, /class="hub-bolt-head-side"/);
  });

  test('shell shape controls merge from presets and explicit overrides', () => {
    const config = normalizeOptions({
      hub: {
        preset: 'dt-swiss-350-mtb-boost-rear-6bolt',
        flangeStickOut: 7,
        centerShellDia: 29,
        curveDrama: 0.5
      }
    });

    assert.equal(config.hub.flangeStickOut, 7);
    assert.equal(config.hub.centerShellDia, 29);
    assert.equal(config.hub.curveDrama, 0.5);
  });
});
