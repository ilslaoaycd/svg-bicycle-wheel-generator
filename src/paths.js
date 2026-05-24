import { circle, fmt, path, rect } from './svg.js';
import { polar } from './math.js';

export function circlePath(cx, cy, r, clockwise = true) {
  const sweep = clockwise ? 1 : 0;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z `;
}

function closedFitSplinePath(points, tension = 0.45) {
  if (points.length < 3) return '';
  let d = `M ${points[0].x} ${points[0].y} `;
  points.forEach((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];
    const cp1 = {
      x: point.x + (((next.x - previous.x) * tension) / 6),
      y: point.y + (((next.y - previous.y) * tension) / 6)
    };
    const cp2 = {
      x: next.x - (((afterNext.x - point.x) * tension) / 6),
      y: next.y - (((afterNext.y - point.y) * tension) / 6)
    };
    d += `C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${next.x} ${next.y} `;
  });
  return `${d}Z `;
}

export function createJBendFlangePath(cx, cy, outerRadius, holes, showHoles) {
  let d = circlePath(cx, cy, outerRadius, true);
  if (showHoles) {
    holes.forEach((point) => {
      d += circlePath(point.x, point.y, 1.8, false);
    });
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}

export function create6BoltPath(cx, cy) {
  const points = [];
  for (let index = 0; index < 6; index += 1) {
    const angle = index * (Math.PI / 3);
    points.push(
      polar(cx, cy, 16.7, angle - 0.32),
      polar(cx, cy, 21.3, angle - 0.39),
      polar(cx, cy, 26, angle - 0.29),
      polar(cx, cy, 28.6, angle - 0.075),
      polar(cx, cy, 28.6, angle + 0.075),
      polar(cx, cy, 26, angle + 0.29),
      polar(cx, cy, 21.3, angle + 0.39),
      polar(cx, cy, 16.7, angle + 0.32),
      polar(cx, cy, 13.8, angle + (Math.PI / 6))
    );
  }

  let d = closedFitSplinePath(points);
  for (let index = 0; index < 6; index += 1) {
    const boltCenter = polar(cx, cy, 22, index * (Math.PI / 3));
    d += circlePath(boltCenter.x, boltCenter.y, 2.8, false);
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}

export function createCenterlockPath(cx, cy) {
  return `${circlePath(cx, cy, 21, true)}${circlePath(cx, cy, 6, false)}`;
}

export function createFreehubSplineFacePath(cx, cy, options = {}) {
  const majorRadius = 17.45;
  const minorRadius = 15.9;
  const chamferDepth = 0.4;
  const chamferRad = 0.025;
  const toothCount = options.toothCount || 9;
  const innerRadius = options.innerRadius || 10;
  const splineScale = options.splineScale || 1;
  const standardSpline = ((2 * Math.PI) / toothCount) * 0.6 * splineScale;
  const standardValley = ((2 * Math.PI) / toothCount) - standardSpline;
  const pattern = Array.from({ length: toothCount }, (_item, index) => {
    if (toothCount === 9 && index === 0) return [standardSpline * 0.55, standardValley * 0.7];
    if (toothCount === 9 && index === toothCount - 1) return [standardSpline, standardValley * 1.25];
    return [standardSpline, standardValley];
  });

  let d = '';
  let currentAngle = (-Math.PI / 2) - (pattern[0][0] / 2);
  pattern.forEach(([splineWidth, valleyWidth], index) => {
    const start = currentAngle;
    const end = currentAngle + splineWidth;
    const nextStart = end + valleyWidth;
    const p1 = polar(cx, cy, minorRadius, start);
    const p2 = polar(cx, cy, majorRadius - chamferDepth, start);
    const p3 = polar(cx, cy, majorRadius, start + chamferRad);
    const p4 = polar(cx, cy, majorRadius, end - chamferRad);
    const p5 = polar(cx, cy, majorRadius - chamferDepth, end);
    const p6 = polar(cx, cy, minorRadius, end);
    const pNext = polar(cx, cy, minorRadius, nextStart);
    if (index === 0) d += `M ${p1.x} ${p1.y} `;
    d += `L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${majorRadius} ${majorRadius} 0 0 1 ${p4.x} ${p4.y} L ${p5.x} ${p5.y} L ${p6.x} ${p6.y} `;
    d += `A ${minorRadius} ${minorRadius} 0 0 1 ${pNext.x} ${pNext.y} `;
    currentAngle = nextStart;
  });

  return `${d}Z ${circlePath(cx, cy, innerRadius, false)}`;
}

export function createHGFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy);
}

export function createMicrosplineFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy, { toothCount: 18, splineScale: 0.72 });
}

export function createXDFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy, { innerRadius: 15 });
}

export function createStraightPullFlangePath(cx, cy, radius, holes) {
  const arms = Math.floor(holes.length / 2);
  if (arms === 0) return '';
  const slice = (2 * Math.PI) / arms;
  const peakRadius = radius + 4;
  const valleyRadius = Math.max(22, peakRadius - 6);
  const valleyHalf = Math.min(slice * 0.34, 0.32);
  const shoulderHalf = Math.min(slice * 0.22, 0.21);
  const plateauHalf = Math.min(slice * 0.085, 0.085);
  const curveHandle = Math.min(5.5, slice * peakRadius * 0.18);

  const commandCurve = (from, to, scale = 1) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy) || 1;
    const handle = Math.min(curveHandle * scale, distance * 0.42);
    const ux = dx / distance;
    const uy = dy / distance;
    const c1 = {
      x: from.x + (ux * handle),
      y: from.y + (uy * handle)
    };
    const c2 = {
      x: to.x - (ux * handle),
      y: to.y - (uy * handle)
    };
    return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y} `;
  };

  const lobes = Array.from({ length: arms }, (_item, index) => {
    const h1 = holes[index * 2];
    const h2 = holes[(index * 2) + 1];
    let a1 = Math.atan2(h1.y - cy, h1.x - cx);
    let a2 = Math.atan2(h2.y - cy, h2.x - cx);
    if (a1 < 0) a1 += 2 * Math.PI;
    if (a2 < 0) a2 += 2 * Math.PI;
    if (a2 < a1) a2 += 2 * Math.PI;
    const centerAngle = a1 + ((a2 - a1) / 2);
    return {
      valleyLeft: polar(cx, cy, valleyRadius, centerAngle - valleyHalf),
      shoulderLeft: polar(cx, cy, valleyRadius + 2.1, centerAngle - shoulderHalf),
      peakLeft: polar(cx, cy, peakRadius, centerAngle - plateauHalf),
      peakRight: polar(cx, cy, peakRadius, centerAngle + plateauHalf),
      shoulderRight: polar(cx, cy, valleyRadius + 2.1, centerAngle + shoulderHalf),
      valleyRight: polar(cx, cy, valleyRadius, centerAngle + valleyHalf),
      aValleyLeft: centerAngle - valleyHalf,
      aShoulderLeft: centerAngle - shoulderHalf,
      aPeakLeft: centerAngle - plateauHalf,
      aPeakRight: centerAngle + plateauHalf,
      aShoulderRight: centerAngle + shoulderHalf,
      aValleyRight: centerAngle + valleyHalf
    };
  });

  let d = `M ${lobes[0].valleyLeft.x} ${lobes[0].valleyLeft.y} `;
  lobes.forEach((lobe, index) => {
    d += commandCurve(lobe.valleyLeft, lobe.shoulderLeft, 0.72);
    d += commandCurve(lobe.shoulderLeft, lobe.peakLeft, 1.12);
    d += commandCurve(lobe.peakLeft, lobe.peakRight, 0.52);
    d += commandCurve(lobe.peakRight, lobe.shoulderRight, 1.12);
    d += commandCurve(lobe.shoulderRight, lobe.valleyRight, 0.72);

    const next = lobes[(index + 1) % arms];
    const nextValleyLeft = index === arms - 1
      ? polar(cx, cy, valleyRadius, next.aValleyLeft + (2 * Math.PI))
      : next.valleyLeft;
    d += commandCurve(lobe.valleyRight, nextValleyLeft, 1.28);
  });

  return `${d}Z ${circlePath(cx, cy, 6, false)}`;
}

export function createJBendFlangeSidePath(x, cy, flangeDia, spokesPerSide, hubStep, isLeft) {
  const width = 3;
  const height = flangeDia + 8;
  const startY = cy - (flangeDia / 2) - 4;
  let d = `M ${x} ${startY} L ${x + width} ${startY} L ${x + width} ${startY + height} L ${x} ${startY + height} Z `;
  const radius = flangeDia / 2;
  const offset = isLeft ? 0 : hubStep / 2;
  for (let index = 0; index < spokesPerSide; index += 1) {
    const angle = (-Math.PI / 2) + (index * hubStep) + offset;
    const holeY = cy + (radius * Math.sin(angle));
    const apparentHeight = Math.max(0.3, 2.2 * Math.abs(Math.cos(angle)));
    const y = holeY - (apparentHeight / 2);
    d += `M ${x} ${y} L ${x} ${y + apparentHeight} L ${x + width} ${y + apparentHeight} L ${x + width} ${y} Z `;
  }
  return d;
}

export function renderValve(config, center, innerRadius) {
  const valve = polar(center, center, innerRadius, -Math.PI / 2);
  if (config.wheel.valveType === 'presta') {
    return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)">${rect(-3, 0, 6, 48, { class: 'wheel-valve-part wheel-valve-stem', rx: 1 })}${rect(-5, 0, 10, 3, { class: 'wheel-valve-part wheel-valve-base', rx: 0.5 })}${rect(-2, 48, 4, 6, { class: 'wheel-valve-part wheel-valve-cap', rx: 0.5 })}</g>`;
  }
  if (config.wheel.valveType === 'schrader') {
    return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)">${rect(-4, 0, 8, 30, { class: 'wheel-valve-part wheel-valve-stem', rx: 1 })}${rect(-5, 0, 10, 3, { class: 'wheel-valve-part wheel-valve-base', rx: 0.5 })}${rect(-4.5, 22, 9, 8, { class: 'wheel-valve-part wheel-valve-cap', rx: 1 })}</g>`;
  }
  return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)"><text class="valve-label" transform="rotate(90)" x="8" y="0" dominant-baseline="middle" text-anchor="start" letter-spacing="2">VALVE</text></g>`;
}

export function spokeNipple(hubPoint, rimPoint) {
  const dx = hubPoint.x - rimPoint.x;
  const dy = hubPoint.y - rimPoint.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  return { x2: rimPoint.x + ((dx / distance) * 10), y2: rimPoint.y + ((dy / distance) * 10) };
}

export { circle, path };
