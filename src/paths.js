import { circle, path, rect } from './svg.js';
import { polar } from './math.js';

export function circlePath(cx, cy, r, clockwise = true) {
  const sweep = clockwise ? 1 : 0;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z `;
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
  let d = '';
  for (let index = 0; index < 6; index += 1) {
    const angle = index * (Math.PI / 3);
    const boltCenter = polar(cx, cy, 22, angle);
    const pRight = polar(boltCenter.x, boltCenter.y, 6, angle + (Math.PI / 2));
    const pLeft = polar(boltCenter.x, boltCenter.y, 6, angle - (Math.PI / 2));
    if (index === 0) d += `M ${pLeft.x} ${pLeft.y} `;
    else {
      const valley = polar(cx, cy, 15, angle - (Math.PI / 6));
      d += `Q ${valley.x} ${valley.y} ${pLeft.x} ${pLeft.y} `;
    }
    d += `A 6 6 0 0 1 ${pRight.x} ${pRight.y} `;
  }
  const firstBolt = polar(cx, cy, 22, 0);
  const firstLeft = polar(firstBolt.x, firstBolt.y, 6, -Math.PI / 2);
  const lastValley = polar(cx, cy, 15, (5 * Math.PI / 3) + (Math.PI / 6));
  d += `Q ${lastValley.x} ${lastValley.y} ${firstLeft.x} ${firstLeft.y} Z `;
  for (let index = 0; index < 6; index += 1) {
    const boltCenter = polar(cx, cy, 22, index * (Math.PI / 3));
    d += circlePath(boltCenter.x, boltCenter.y, 2.5, false);
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}

export function createCenterlockPath(cx, cy) {
  return `${circlePath(cx, cy, 21, true)}${circlePath(cx, cy, 6, false)}`;
}

export function createHGFreehubFacePath(cx, cy) {
  const majorRadius = 17.45;
  const minorRadius = 15.9;
  const chamferDepth = 0.4;
  const chamferRad = 0.025;
  const standardSpline = 0.42;
  const narrowSpline = 0.20;
  const narrowValleyRight = 0.20;
  const wideValleyLeft = 0.40;
  const remaining = (2 * Math.PI) - ((8 * standardSpline) + narrowSpline + narrowValleyRight + wideValleyLeft);
  const standardValley = remaining / 7;
  const pattern = [
    [narrowSpline, narrowValleyRight],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, wideValleyLeft]
  ];

  let d = '';
  let currentAngle = (-Math.PI / 2) - (narrowSpline / 2);
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

  return `${d}Z ${circlePath(cx, cy, 10, false)}`;
}

export function createStraightPullFlangePath(cx, cy, radius, holes) {
  const arms = Math.floor(holes.length / 2);
  if (arms === 0) return '';
  let firstAngle = Math.atan2(holes[0].y - cy, holes[0].x - cx);
  let secondAngle = Math.atan2(holes[1].y - cy, holes[1].x - cx);
  if (firstAngle < 0) firstAngle += 2 * Math.PI;
  if (secondAngle < 0) secondAngle += 2 * Math.PI;
  if (secondAngle < firstAngle) secondAngle += 2 * Math.PI;

  const armGap = secondAngle - firstAngle;
  const slice = (2 * Math.PI) / arms;
  const emptySpace = slice - armGap;
  const outerRadius = radius + 6;
  const innerRadius = Math.max(14, radius - 8);
  const valleyRadius = Math.max(10, innerRadius - 5);
  const padLength = Math.min(5, ((emptySpace * innerRadius) / 2) * 0.75);
  const outerPad = padLength / outerRadius;
  const innerPad = padLength / innerRadius;

  const armsData = Array.from({ length: arms }, (_item, armIndex) => {
    const h1 = holes[armIndex * 2];
    const h2 = holes[(armIndex * 2) + 1];
    let a1 = Math.atan2(h1.y - cy, h1.x - cx);
    let a2 = Math.atan2(h2.y - cy, h2.x - cx);
    if (a1 < 0) a1 += 2 * Math.PI;
    if (a2 < 0) a2 += 2 * Math.PI;
    if (a2 < a1) a2 += 2 * Math.PI;
    return {
      pIL: polar(cx, cy, innerRadius, a1 - innerPad),
      pOL: polar(cx, cy, outerRadius, a1 - outerPad),
      pOR: polar(cx, cy, outerRadius, a2 + outerPad),
      pIR: polar(cx, cy, innerRadius, a2 + innerPad),
      aInnerLeft: a1 - innerPad,
      aInnerRight: a2 + innerPad
    };
  });

  let d = '';
  armsData.forEach((current, index) => {
    if (index === 0) {
      d += `M ${current.pIL.x} ${current.pIL.y} `;
    } else {
      const previous = armsData[index - 1];
      let leftAngle = previous.aInnerRight;
      let rightAngle = current.aInnerLeft;
      if (rightAngle < leftAngle) rightAngle += 2 * Math.PI;
      const valley = polar(cx, cy, valleyRadius, leftAngle + ((rightAngle - leftAngle) / 2));
      d += `Q ${valley.x} ${valley.y} ${current.pIL.x} ${current.pIL.y} `;
    }
    d += `L ${current.pOL.x} ${current.pOL.y} A ${outerRadius} ${outerRadius} 0 0 1 ${current.pOR.x} ${current.pOR.y} L ${current.pIR.x} ${current.pIR.y} `;
  });

  const last = armsData[arms - 1];
  const first = armsData[0];
  let rightAngle = first.aInnerLeft;
  if (rightAngle < last.aInnerRight) rightAngle += 2 * Math.PI;
  const valley = polar(cx, cy, valleyRadius, last.aInnerRight + ((rightAngle - last.aInnerRight) / 2));
  return `${d}Q ${valley.x} ${valley.y} ${first.pIL.x} ${first.pIL.y} Z ${circlePath(cx, cy, 6, false)}`;
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
    return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)">${rect(-3, 0, 6, 48, { fill: '#adb5bd', rx: 1 })}${rect(-5, 0, 10, 3, { fill: '#6c757d', rx: 0.5 })}${rect(-2, 48, 4, 6, { fill: '#ced4da', rx: 0.5 })}</g>`;
  }
  if (config.wheel.valveType === 'schrader') {
    return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)">${rect(-4, 0, 8, 30, { fill: '#343a40', rx: 1 })}${rect(-5, 0, 10, 3, { fill: '#6c757d', rx: 0.5 })}${rect(-4.5, 22, 9, 8, { fill: '#212529', rx: 1 })}</g>`;
  }
  return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)"><text class="valve-label" transform="rotate(90)" x="8" y="0" dominant-baseline="middle" text-anchor="start" letter-spacing="2">VALVE</text></g>`;
}

export function spokeNipple(hubPoint, rimPoint) {
  const dx = hubPoint.x - rimPoint.x;
  const dy = hubPoint.y - rimPoint.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  return { x2: rimPoint.x + ((dx / distance) * 10), y2: rimPoint.y + ((dy / distance) * 10) };
}

export { circle, path };
