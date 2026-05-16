# SVG Bicycle Wheel Generator

Generate pure SVG strings for bicycle wheel, hub, spoke-lacing, rim, brake mount,
valve, and side-profile previews. The runtime is DOM-free JavaScript math, so it
works in Node.js, browsers, bundlers, server renderers, edge runtimes, and script
tags.

This package ports the standalone `Wheel Genorator.html` visualizer into the
same library structure as `svg-bicycle-drivetrain-generator`.

## Install

```bash
npm install svg-bicycle-wheel-generator
```

You can also install from GitHub:

```bash
npm install github:ilslaoaycd/svg-bicycle-wheel-generator
```

## Quick Start

```js
import {
  BicycleWheelSVG,
  renderHubSideSvg,
  renderWheelFaceSvg
} from 'svg-bicycle-wheel-generator';

const wheel = renderWheelFaceSvg({
  view: { wheelFaceSide: 'right' },
  wheel: {
    outerDia: 634,
    erd: 601,
    rimWidth: 25,
    spokeCount: 32,
    valveType: 'presta'
  },
  hub: {
    hubPosition: 'rear',
    brakeType: '6bolt',
    hubType: 'jbend',
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3
  },
  lacing: { crossPattern: 3 },
  style: {
    spokeLayering: '3d',
    spokeColor: 'color',
    nippleStyle: 'nipples',
    nippleColor: 'silver'
  }
});

const generator = new BicycleWheelSVG();
const side = generator.wheelSide();
const hub = renderHubSideSvg();
```

## API

### Facade

```js
const generator = new BicycleWheelSVG(config);

generator.wheel(options);
generator.wheelFace(options);
generator.wheelSide(options);
generator.hubFace(options);
generator.hubSide(options);
generator.spokeBuild(options);
```

### Convenience Functions

```js
renderWheelSvg(options);
renderWheelFaceSvg(options);
renderWheelSideSvg(options);
renderHubFaceSvg(options);
renderHubSideSvg(options);
```

### Lower-Level Exports

The package also exports `WheelFaceSVGGenerator`, `WheelSideSVGGenerator`,
`HubSVGGenerator`, `calculateSpokeLength`, `calculateWheelBuild`,
`rimHolePositions`, `hubHolePositions`, `lacingMap`, `normalizeOptions`, and
`validateWheelBuild`.

## Options

Options may be passed in nested groups, or as the flat state names used by the
original HTML visualizer.

```js
renderWheelFaceSvg({
  wheel: {
    outerDia: 634,
    erd: 601,
    rimWidth: 25,
    rimOffset: 0,
    spokeCount: 32,
    valveType: 'presta' // "presta", "schrader", or "marker"
  },
  hub: {
    hubPosition: 'rear', // "front" or "rear"
    brakeType: '6bolt', // "rim", "6bolt", or "centerlock"
    hubType: 'jbend', // "jbend" or "straightpull"
    showHubHoles: 'visible',
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3
  },
  lacing: {
    crossPattern: 3
  },
  view: {
    wheelFaceSide: 'left',
    hubFaceSide: 'left'
  },
  style: {
    spokeLayering: '3d', // "3d" or "flat"
    spokeColor: 'color', // "color", "black", or "silver"
    nippleStyle: 'nipples',
    nippleColor: 'silver'
  }
});
```

## Examples

Run:

```bash
npm run examples
```

Generated SVG examples are written to `examples/svg`.

## Development

```bash
npm install
npm test
```
