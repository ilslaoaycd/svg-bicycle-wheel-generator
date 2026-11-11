import { resolveStyleOptions, stylePresetOptions } from './styles.js';

export const DEFAULT_WHEEL = {
  outerDia: 634,
  erd: 601,
  rimWidth: 25,
  rimOffset: 0,
  holeStagger: 0,
  holeRows: 'same-side',
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
  spokeOffsetNds: 0,
  spokeOffsetDs: 0,
  pairedHoleAngle: 0,
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
  crossPattern: 3,
  lengthAdjustment: 0
};

export const DEFAULT_VIEW = {
  wheelFaceSide: 'left',
  hubFaceSide: 'left',
  hubFaceFlangeMode: 'both'
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
    holeStagger: options.holeStagger,
    holeRows: options.holeRows,
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
    spokeOffsetNds: options.spokeOffsetNds,
    spokeOffsetDs: options.spokeOffsetDs,
    pairedHoleAngle: options.pairedHoleAngle,
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

// ---------------------------------------------------------------------------
// Spoke length
//
// The model follows the DT Swiss spoke calculator (spokes-calculator.dtswiss.com,
// its client-side formula read 2026-11-11), with the rim spoke-bed offset,
// width between holes and paired-hole hubs handled the way spokecalc.io does:
//
//   L = sqrt( (r sin a)^2 + (R - r cos a)^2 + W^2 ) + end correction
//
//   R  = ERD / 2                 r = flange pitch-circle diameter / 2
//   a  = 4 * PI * X / N          the angle between hub hole and rim hole
//   W  = lateral distance from the flange to that side's rim holes
//
// J-bend: X is the cross pattern (plus the paired-hole correction for hubs
// drilled in pairs) and the end correction is -(spoke hole diameter / 2).
// Straight pull: DT sets X by spoke count, not by the pattern asked for --
// 2.5 up to 24 spokes, 3.5 above (2x / 3x plus the half-hole the paired
// spoke pockets add), 0 for radial -- and the end correction is +(the hub's
// published spoke offset).
// ---------------------------------------------------------------------------

export const SPOKE_TYPES = { jbend: 'jbend', straightpull: 'straightpull' };

export function isStraightPull(type) {
  const value = String(type || '').toLowerCase().replace(/[^a-z]/g, '');
  return value === 'straightpull';
}

// The cross pattern a straight-pull hub is laced in, as DT Swiss assumes it:
// 2x up to 24 spokes, 3x above, radial when radial was asked for.
export function straightPullDesignedCross(spokeCount, crossPattern) {
  if (!(crossPattern > 0)) return 0;
  return spokeCount <= 24 ? 2 : 3;
}

// The lacing value X the length formula uses (see above).
export function effectiveCross({ spokeType, spokeCount, crossPattern, pairedHoleAngle }) {
  if (isStraightPull(spokeType)) {
    const designed = straightPullDesignedCross(spokeCount, crossPattern);
    return designed === 0 ? 0 : designed + 0.5;
  }
  const cross = Number.isFinite(crossPattern) ? crossPattern : 0;
  const pitch = 720 / spokeCount;
  if (pairedHoleAngle > 0 && Number.isFinite(pitch)) {
    return cross + ((pitch - pairedHoleAngle) / 2) / pitch;
  }
  return cross;
}

// Lateral distance from one flange to that side's row of rim holes.
// Coordinates: x along the axle, + toward the right/drive side. rimOffset is
// the spoke-bed offset (+ = toward the right). holeStagger is the width
// between the two rows of holes; normally each side's holes sit on its own
// side of the rim (spokes shorten), unless the spokes cross the centreline
// to reach the far row (holeRows 'crossed', spokes lengthen).
export function lateralSpokeDistance({ side, flangeCenter, rimOffset = 0, holeStagger = 0, holeRows = 'same-side' }) {
  const offset = Number.isFinite(rimOffset) ? rimOffset : 0;
  const half = Number.isFinite(holeStagger) ? holeStagger / 2 : 0;
  const rowShift = holeRows === 'crossed' ? half : -half;
  return side === 'left'
    ? flangeCenter + offset + rowShift
    : flangeCenter - offset + rowShift;
}

export function calculateSpokeLength(params) {
  const straightPull = isStraightPull(params.spokeType);
  const x = effectiveCross(params);
  const angle = (4 * Math.PI * x) / params.spokeCount;
  const erdRadius = params.erd / 2;
  const flangeRadius = params.flangeDia / 2;
  const lateral = Number.isFinite(params.lateralDistance) ? params.lateralDistance : params.flangeCenter;
  const run = Math.sqrt(
    ((flangeRadius * Math.sin(angle)) ** 2) +
      ((erdRadius - (flangeRadius * Math.cos(angle))) ** 2) +
      (lateral ** 2)
  );
  const holeDia = Number.isFinite(params.spokeHoleDia) ? params.spokeHoleDia : 2.6;
  const spokeOffset = Number.isFinite(params.spokeOffset) ? params.spokeOffset : 0;
  const endCorrection = straightPull ? spokeOffset : -(holeDia / 2);
  return run + endCorrection + (Number.isFinite(params.lengthAdjustment) ? params.lengthAdjustment : 0);
}

// Spoke lengths, bracing angles and the lacing the formula used, for a whole
// wheel. Accepts the same options as the renderers.
export function calculateWheelBuild(options = {}) {
  const config = normalizeOptions(options);
  const { wheel, hub, lacing } = config;
  const side = (which) => {
    const left = which === 'left';
    const lateralDistance = lateralSpokeDistance({
      side: which,
      flangeCenter: left ? hub.leftFlangeCenter : hub.rightFlangeCenter,
      rimOffset: wheel.rimOffset,
      holeStagger: wheel.holeStagger,
      holeRows: wheel.holeRows
    });
    const length = calculateSpokeLength({
      erd: wheel.erd,
      flangeDia: left ? hub.leftFlangeDia : hub.rightFlangeDia,
      lateralDistance,
      spokeHoleDia: hub.spokeHoleDia,
      spokeOffset: left ? hub.spokeOffsetNds : hub.spokeOffsetDs,
      spokeCount: wheel.spokeCount,
      crossPattern: lacing.crossPattern,
      pairedHoleAngle: hub.pairedHoleAngle,
      spokeType: hub.hubType,
      lengthAdjustment: lacing.lengthAdjustment
    });
    const bracingAngle = Math.asin(Math.min(1, Math.abs(lateralDistance) / length)) * (180 / Math.PI);
    return { length, lateralDistance, bracingAngle };
  };
  const l = side('left');
  const r = side('right');

  return {
    left: l.length,
    right: r.length,
    roundedLeft: round(l.length, 1),
    roundedRight: round(r.length, 1),
    leftBracingAngle: l.bracingAngle,
    rightBracingAngle: r.bracingAngle,
    leftLateralDistance: l.lateralDistance,
    rightLateralDistance: r.lateralDistance,
    effectiveCross: effectiveCross({
      spokeType: hub.hubType,
      spokeCount: wheel.spokeCount,
      crossPattern: lacing.crossPattern,
      pairedHoleAngle: hub.pairedHoleAngle
    })
  };
}

// The furthest the spoke bed can sit off the rim's centre and still keep the
// nipple holes on it: half the rim width, less the half stagger and a 2 mm
// margin. Never negative.
export function maxRimOffset(rimWidth, holeStagger = 0) {
  if (!Number.isFinite(rimWidth)) return Infinity;
  const half = Number.isFinite(holeStagger) ? holeStagger / 2 : 0;
  return Math.max(0, (rimWidth / 2) - half - 2);
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
