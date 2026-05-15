# SVG Bicycle Wheel Generator

Generate pure SVG strings for bicycle wheels, hubs, spoke lacing diagrams, side-profile bracing-angle views, and spoke calculator previews. The runtime is vanilla JavaScript math returning SVG text, so it works in browsers, bundlers, Node.js, server renderers, edge runtimes, and script tags.

This package is designed to be reused by product previews and by spoke-calculator interfaces. It starts with technical schematic rendering rather than photorealistic artwork.

## Install

```bash
npm install svg-bicycle-wheel-generator
```

The cassette integration is optional. Install `svg-bicycle-drivetrain-generator` only when you want to render a cassette inside a wheel preview.

## Quick Start

```js
import {
  BicycleWheelSVG,
  renderWheelFaceSvg,
  renderWheelSideSvg,
  calculateWheelBuild
} from 'svg-bicycle-wheel-generator';

const svg = renderWheelFaceSvg({
  view: 'both',
  style: 'technical',
  wheel: { erd: 601, rimDepth: 28, rimWidth: 25, spokeCount: 32 },
  hub: {
    old: 142,
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3
  },
  lacing: { leftCross: 3, rightCross: 3 }
});

const lengths = calculateWheelBuild({
  wheel: { erd: 601, spokeCount: 32 },
  hub: { leftFlangeDia: 44, rightFlangeDia: 44, leftFlangeCenter: 22.4, rightFlangeCenter: 35 },
  lacing: { leftCross: 3, rightCross: 3 }
});
```

## API

```js
const generator = new BicycleWheelSVG();

generator.wheel(options);
generator.wheelFace(options);
generator.wheelSide(options);
generator.hubFace(options);
generator.hubSide(options);
generator.spokeBuild(options);
```

Convenience exports:

- `renderWheelSvg(options)`
- `renderWheelFaceSvg(options)`
- `renderWheelSideSvg(options)`
- `renderHubFaceSvg(options)`
- `renderHubSideSvg(options)`
- `calculateSpokeLength(params)`
- `calculateWheelBuild(options)`

## Options

```js
{
  wheel: {
    erd: 601,
    outerDiameter: 622,
    rimDepth: 24,
    rimWidth: 24,
    rimOffset: 0,
    spokeCount: 32,
    valveAngle: -90
  },
  hub: {
    old: 100,
    leftFlangeDia: 44,
    rightFlangeDia: 44,
    leftFlangeCenter: 22.4,
    rightFlangeCenter: 35,
    spokeHoleDia: 2.6,
    axleDiameter: 12,
    shellDiameter: 32
  },
  lacing: {
    leftCross: 3,
    rightCross: 3,
    leftPattern: 'cross',
    rightPattern: 'cross'
  },
  view: 'both',
  style: 'technical',
  styleConfig: {}
}
```

`view` supports `both`, `left`, `right`, and `detail` for wheel face renderings.

Style presets:

- `technical`
- `blueprint`
- `productPreview`
- `debug`

## Optional Cassette Rendering

The core package does not bundle drivetrain rendering. Pass a cassette renderer only when needed:

```js
import { renderCassetteSvg } from 'svg-bicycle-drivetrain-generator';
import { renderWheelFaceSvg } from 'svg-bicycle-wheel-generator';

const svg = renderWheelFaceSvg({
  view: 'right',
  cassette: {
    enabled: true,
    cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 52],
    selectedCog: 18,
    renderer: ({ cogs, style }) => renderCassetteSvg(cogs, { style })
  }
});
```

If `cassette.enabled` is true without a renderer, the wheel preview shows a dashed cassette placeholder and does not require the drivetrain package.

## Development

```bash
npm install
npm run build
npm run examples
npm test
```

Committed examples live in `examples/svg/`.

## License

MIT
