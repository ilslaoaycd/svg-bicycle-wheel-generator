import { resolveStyleOptions, stylePresetOptions } from './styles.js';

export const DEFAULT_WHEEL = {
  outerDia: 634,
  erd: 601,
  rimWidth: 25,
  rimOffset: 0,
  spokeCount: 32,
  valveType: 'presta'
};

export const DEFAULT_HUB = {
  hubPosition: 'rear',
  brakeType: '6bolt',
  hubType: 'jbend',
  showHubHoles: 'visible',
  builtInDimension: 142,
  leftFlangeDia: 58,
  rightFlangeDia: 52,
  leftFlangeCenter: 36.6,
  rightFlangeCenter: 23.3,
  spokeHoleDia: 2.6,
  brandStyle: 'generic',
  shellStyle: 'tapered',
  shellWaistDia: 24,
  shellBodyDia: 31,
  flangeThickness: 4,
  endcapLength: 8,
  endcapDia: 18,
  freehubLength: 36,
  freehubDia: 35,
  freehubType: 'hg',
  brakeMountWidth: 5,
  brakeMountDia: 44,
  flangeCutoutStyle: 'none',
  flangeStickOut: 4,
  centerShellDia: 25,
  curveDrama: 0.35
};

export const HUB_PRESETS = {
  'dt-swiss-350-mtb-boost-rear-6bolt': {
    name: 'DT Swiss 350 MTB Boost Rear 6-Bolt',
    hubPosition: 'rear',
    brakeType: '6bolt',
    hubType: 'jbend',
    builtInDimension: 148,
    leftFlangeDia: 60,
    rightFlangeDia: 50.5,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.4,
    spokeHoleDia: 2.6,
    brandStyle: 'dt-swiss',
    shellStyle: 'smooth-taper',
    shellWaistDia: 23,
    shellBodyDia: 32,
    flangeThickness: 4,
    endcapLength: 8,
    endcapDia: 19,
    freehubLength: 37,
    freehubDia: 34,
    freehubType: 'xd',
    brakeMountWidth: 5,
    brakeMountDia: 44,
    flangeCutoutStyle: 'lightening-slots',
    flangeStickOut: 4,
    centerShellDia: 25,
    curveDrama: 0.32
  },
  'dt-swiss-240-exp-boost-rear-centerlock': {
    name: 'DT Swiss 240 EXP Boost Rear Center Lock',
    hubPosition: 'rear',
    brakeType: 'centerlock',
    hubType: 'jbend',
    builtInDimension: 148,
    leftFlangeDia: 50.4,
    rightFlangeDia: 50.4,
    leftFlangeCenter: 37.3,
    rightFlangeCenter: 22.6,
    spokeHoleDia: 2.5,
    brandStyle: 'dt-swiss',
    shellStyle: 'smooth-taper',
    shellWaistDia: 22,
    shellBodyDia: 30,
    flangeThickness: 3.5,
    endcapLength: 8,
    endcapDia: 18,
    freehubLength: 37,
    freehubDia: 33,
    freehubType: 'hg',
    brakeMountWidth: 5,
    brakeMountDia: 42,
    flangeCutoutStyle: 'lightening-slots',
    flangeStickOut: 4,
    centerShellDia: 24,
    curveDrama: 0.3
  },
  'industry-nine-hydra2-boost-rear-6bolt': {
    name: 'Industry Nine Hydra2 Classic 12x148 Rear 6-Bolt',
    hubPosition: 'rear',
    brakeType: '6bolt',
    hubType: 'jbend',
    builtInDimension: 148,
    leftFlangeDia: 59.5,
    rightFlangeDia: 62,
    leftFlangeCenter: 36.9,
    rightFlangeCenter: 23.7,
    spokeHoleDia: 2.6,
    brandStyle: 'industry-nine',
    shellStyle: 'fluted',
    shellWaistDia: 25,
    shellBodyDia: 34,
    flangeThickness: 5,
    endcapLength: 8,
    endcapDia: 19,
    freehubLength: 37,
    freehubDia: 36,
    freehubType: 'xd',
    brakeMountWidth: 5,
    brakeMountDia: 46,
    flangeCutoutStyle: 'scalloped',
    flangeStickOut: 5,
    centerShellDia: 28,
    curveDrama: 0.42
  },
  'industry-nine-solix-road-rear-centerlock': {
    name: 'Industry Nine Solix CL Road Rear',
    hubPosition: 'rear',
    brakeType: 'centerlock',
    hubType: 'jbend',
    builtInDimension: 142,
    leftFlangeDia: 41,
    rightFlangeDia: 53,
    leftFlangeCenter: 33,
    rightFlangeCenter: 19,
    spokeHoleDia: 2.5,
    brandStyle: 'industry-nine',
    shellStyle: 'fluted',
    shellWaistDia: 23,
    shellBodyDia: 31,
    flangeThickness: 4.5,
    endcapLength: 7,
    endcapDia: 18,
    freehubLength: 37,
    freehubDia: 34,
    freehubType: 'xd',
    brakeMountWidth: 5,
    brakeMountDia: 42,
    flangeCutoutStyle: 'scalloped',
    flangeStickOut: 4,
    centerShellDia: 24,
    curveDrama: 0.38
  }
};

export const DEFAULT_LACING = {
  crossPattern: 3
};

export const DEFAULT_VIEW = {
  wheelFaceSide: 'left',
  hubFaceSide: 'left'
};

export const DEFAULT_STYLE = {
  spokeLayering: '3d',
  spokeColor: 'black',
  nippleStyle: 'nipples',
  nippleColor: 'black',
  theme: 'drawing',
  paintMode: 'hybrid',
  palette: {}
};

export function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function polar(centerX, centerY, radius, angle) {
  return {
    x: centerX + (radius * Math.cos(angle)),
    y: centerY + (radius * Math.sin(angle)),
    angle
  };
}

export function normalizeFreehubType(type = 'hg') {
  const normalized = String(type).toLowerCase();
  if (normalized.includes('micro')) return 'microspline';
  if (normalized.includes('xd')) return 'xd';
  return 'hg';
}

export function normalizeOptions(options = {}) {
  const flatWheel = {
    outerDia: options.outerDia,
    erd: options.erd,
    rimWidth: options.rimWidth,
    rimOffset: options.rimOffset,
    spokeCount: options.spokeCount,
    valveType: options.valveType
  };
  const flatHub = {
    hubPosition: options.hubPosition,
    brakeType: options.brakeType,
    hubType: options.hubType,
    showHubHoles: options.showHubHoles,
    preset: options.preset,
    builtInDimension: options.builtInDimension,
    leftFlangeDia: options.leftFlangeDia,
    rightFlangeDia: options.rightFlangeDia,
    leftFlangeCenter: options.leftFlangeCenter,
    rightFlangeCenter: options.rightFlangeCenter,
    spokeHoleDia: options.spokeHoleDia,
    brandStyle: options.brandStyle,
    shellStyle: options.shellStyle,
    shellWaistDia: options.shellWaistDia,
    shellBodyDia: options.shellBodyDia,
    flangeThickness: options.flangeThickness,
    endcapLength: options.endcapLength,
    endcapDia: options.endcapDia,
    freehubLength: options.freehubLength,
    freehubDia: options.freehubDia,
    freehubType: options.freehubType,
    brakeMountWidth: options.brakeMountWidth,
    brakeMountDia: options.brakeMountDia,
    flangeCutoutStyle: options.flangeCutoutStyle,
    flangeStickOut: options.flangeStickOut,
    centerShellDia: options.centerShellDia,
    curveDrama: options.curveDrama
  };
  const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
  const wheelOptions = { ...compact(flatWheel), ...(options.wheel || {}) };
  const hubOptions = { ...compact(flatHub), ...(options.hub || {}) };
  const hubPreset = HUB_PRESETS[hubOptions.preset] || {};
  const styleInput = typeof options.style === 'object' ? options.style : {};
  const presetOptions = stylePresetOptions(styleInput);
  const view = typeof options.view === 'string'
    ? { wheelFaceSide: options.view, hubFaceSide: options.view }
    : options.view || {};

  const hub = { ...DEFAULT_HUB, ...hubPreset, ...presetOptions.hub, ...hubOptions };
  hub.freehubType = normalizeFreehubType(hub.freehubType);
  if (hub.brakeType === 'rim') {
    hub.brakeMountWidth = 0;
  }

  return {
    wheel: { ...DEFAULT_WHEEL, ...presetOptions.wheel, ...wheelOptions },
    hub,
    lacing: { ...DEFAULT_LACING, ...(options.lacing || {}) },
    view: { ...DEFAULT_VIEW, ...view },
    style: resolveStyleOptions(styleInput)
  };
}

export function calculateSpokeLength(params) {
  const theta = (4 * Math.PI * params.crossPattern) / params.spokeCount;
  const erdRadius = params.erd / 2;
  const flangeRadius = params.flangeDia / 2;
  const planarDistance = Math.sqrt(
    (erdRadius ** 2) +
      (flangeRadius ** 2) -
      (2 * erdRadius * flangeRadius * Math.cos(theta))
  );

  return Math.sqrt((planarDistance ** 2) + (params.flangeCenter ** 2)) -
    ((params.spokeHoleDia || 2.6) / 2) +
    (params.lengthAdjustment || 0);
}

export function calculateWheelBuild(options = {}) {
  const config = normalizeOptions(options);
  const { wheel, hub, lacing } = config;
  const left = calculateSpokeLength({
    erd: wheel.erd,
    flangeDia: hub.leftFlangeDia,
    flangeCenter: hub.leftFlangeCenter,
    spokeHoleDia: hub.spokeHoleDia,
    spokeCount: wheel.spokeCount,
    crossPattern: lacing.crossPattern
  });
  const right = calculateSpokeLength({
    erd: wheel.erd,
    flangeDia: hub.rightFlangeDia,
    flangeCenter: hub.rightFlangeCenter,
    spokeHoleDia: hub.spokeHoleDia,
    spokeCount: wheel.spokeCount,
    crossPattern: lacing.crossPattern
  });

  return { left, right, roundedLeft: round(left, 1), roundedRight: round(right, 1) };
}

export function calculateRearHubMount(options = {}) {
  const config = normalizeOptions(options);
  const old = config.hub.builtInDimension || (config.hub.hubPosition === 'front' ? 100 : 142);
  const endcapLength = config.hub.endcapLength || 8;
  const flangeThickness = (config.hub.flangeThickness || 4) * (config.hub.hubType === 'straightpull' ? 1.5 : 1);
  const rightEndX = old / 2;
  const rightEndcapStart = rightEndX - endcapLength;
  const rightFlangeX = config.hub.rightFlangeCenter;
  const rightFlangeOuterX = rightFlangeX + (flangeThickness / 2);
  const freehubLength = config.hub.hubPosition === 'rear' ? config.hub.freehubLength : 0;
  const freehubStartX = Math.max(rightEndcapStart - freehubLength, rightFlangeOuterX + 2);
  const freehubEndX = rightEndcapStart;

  return {
    axleCenter: { x: 0, y: 0 },
    driveSide: 'right',
    brakeSide: 'left',
    overLocknutDimension: old,
    leftEndX: -old / 2,
    rightEndX,
    freehubStartX,
    freehubEndX,
    freehubLength: Math.max(0, freehubEndX - freehubStartX),
    freehubRadius: (config.hub.freehubDia || 34) / 2,
    wheelOuterRadius: config.wheel.outerDia / 2,
    wheelInnerRadius: config.wheel.erd / 2,
    rimOffset: config.wheel.rimOffset,
    hub: config.hub,
    wheel: config.wheel
  };
}

export function validateWheelBuild(options = {}) {
  const { wheel, hub, lacing } = normalizeOptions(options);
  const warnings = [];
  [
    ['outer diameter', wheel.outerDia],
    ['ERD', wheel.erd],
    ['rim width', wheel.rimWidth],
    ['spoke count', wheel.spokeCount],
    ['left flange diameter', hub.leftFlangeDia],
    ['right flange diameter', hub.rightFlangeDia],
    ['left center-to-flange', hub.leftFlangeCenter],
    ['right center-to-flange', hub.rightFlangeCenter],
    ['cross pattern', lacing.crossPattern]
  ].forEach(([label, value]) => {
    if (!Number.isFinite(value)) warnings.push(`${label} must be a number.`);
  });

  if (Number.isFinite(wheel.spokeCount) && (wheel.spokeCount < 4 || wheel.spokeCount % 2 !== 0)) {
    warnings.push('Spoke count must be an even number of at least 4.');
  }
  if (Number.isFinite(wheel.spokeCount) && lacing.crossPattern >= (wheel.spokeCount / 4)) {
    warnings.push(`${lacing.crossPattern}x is too high for a ${wheel.spokeCount} spoke wheel.`);
  }
  if (wheel.erd >= wheel.outerDia) warnings.push('ERD must be smaller than the outer diameter.');

  return warnings;
}

export function rimHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const radius = layout.radius || (config.wheel.erd / 2);
  const count = config.wheel.spokeCount;
  const step = (2 * Math.PI) / count;
  return Array.from({ length: count }, (_item, index) => {
    const angle = (-Math.PI / 2) + (step / 2) + (index * step);
    return { index, ...polar(center, center, radius, angle) };
  });
}

export function hubHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const spokesPerSide = config.wheel.spokeCount / 2;
  const rimStep = (2 * Math.PI) / config.wheel.spokeCount;
  const hubStep = (2 * Math.PI) / spokesPerSide;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = (safeCross % 2 === 0 && safeCross > 0) ? 2 : 0;
  const hubAngleOffset = patternShift * rimStep;

  return {
    left: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = (-Math.PI / 2) + (rimStep / 2) + (index * hubStep) + hubAngleOffset;
      return { index, ...polar(center, center, config.hub.leftFlangeDia / 2, angle) };
    }),
    right: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = (-Math.PI / 2) + (rimStep / 2) + (index * hubStep) + hubAngleOffset + (hubStep / 2);
      return { index, ...polar(center, center, config.hub.rightFlangeDia / 2, angle) };
    })
  };
}

export function lacingMap(options = {}) {
  const config = normalizeOptions(options);
  const count = config.wheel.spokeCount;
  const spokesPerSide = count / 2;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = (safeCross % 2 === 0 && safeCross > 0) ? 2 : 0;

  function sideMap(side, rimOffset) {
    return Array.from({ length: spokesPerSide }, (_item, index) => {
      const isPulling = index % 2 === 0;
      const rawIndex = safeCross === 0
        ? (index * 2) + rimOffset + patternShift
        : (index * 2) + (isPulling ? safeCross * 2 : -safeCross * 2) + rimOffset + patternShift;
      return {
        side,
        hubIndex: index,
        rimIndex: ((Math.round(rawIndex) % count) + count) % count,
        type: isPulling ? 'pulling' : 'trailing',
        crosses: safeCross,
        patternShift
      };
    });
  }

  return [...sideMap('left', 0), ...sideMap('right', 1)];
}
