import { hubHolePositions, normalizeOptions, polar } from './math.js';
import {
  circle,
  create6BoltPath,
  createHGFreehubFacePath,
  createJBendFlangePath,
  createMicrosplineFreehubFacePath,
  createStraightPullFlangePath,
  createXDFreehubFacePath,
  path
} from './paths.js';
import { line, rect, svgDocument, tag, visualizerStyle } from './svg.js';
import { hubPaintStyles } from './styles.js';

function activeStyle(config) {
  const style = hubPaintStyles(config.style);
  if (config.style.hubRenderStyle === 'realistic') {
    style.line.opacity = 0.35;
    style.faceReference.opacity = 0.35;
  }
  return style;
}

function isBlueprint(config) {
  return config.style.hubRenderStyle !== 'realistic';
}

function bp(className, style, extra = {}) {
  return { class: className, ...style, ...extra };
}

function hubProfileClass(config) {
  return [
    'hub-side-group',
    `hub-brand-${config.hub.brandStyle || 'generic'}`,
    `hub-shell-${config.hub.shellStyle || 'tapered'}`,
    `hub-render-${config.style.hubRenderStyle || 'blueprint'}`
  ].join(' ');
}

function sideShellPath(points, cy) {
  const top = points.map(([x, dia], index) => `${index === 0 ? 'M' : 'L'} ${x} ${cy - (dia / 2)}`);
  const bottom = points.slice().reverse().map(([x, dia]) => `L ${x} ${cy + (dia / 2)}`);
  return [...top, ...bottom, 'Z'].join(' ');
}

function smoothShellPath(cx, cy, leftFlangeX, rightFlangeX, leftDia, rightDia, config) {
  const waist = config.hub.shellWaistDia;
  const neck = Math.max(waist + 5, config.hub.shellBodyDia);
  const leftShoulderX = leftFlangeX + config.hub.flangeThickness + 2;
  const rightShoulderX = rightFlangeX - config.hub.flangeThickness - 2;
  const centerLeft = cx - 9;
  const centerRight = cx + 9;
  const leftShoulderDia = Math.min(leftDia - 10, neck + 7);
  const rightShoulderDia = Math.min(rightDia - 10, neck + 8);
  const leftControlX = leftShoulderX + Math.max(8, (centerLeft - leftShoulderX) * 0.45);
  const rightControlX = rightShoulderX - Math.max(8, (rightShoulderX - centerRight) * 0.45);
  const top = [
    `M ${leftShoulderX} ${cy - (leftShoulderDia / 2)}`,
    `C ${leftShoulderX + 5} ${cy - (leftShoulderDia / 2)} ${leftControlX} ${cy - (waist / 2)} ${centerLeft} ${cy - (waist / 2)}`,
    `L ${centerRight} ${cy - (waist / 2)}`,
    `C ${rightControlX} ${cy - (waist / 2)} ${rightShoulderX - 5} ${cy - (rightShoulderDia / 2)} ${rightShoulderX} ${cy - (rightShoulderDia / 2)}`
  ];
  const bottom = [
    `L ${rightShoulderX} ${cy + (rightShoulderDia / 2)}`,
    `C ${rightShoulderX - 5} ${cy + (rightShoulderDia / 2)} ${rightControlX} ${cy + (waist / 2)} ${centerRight} ${cy + (waist / 2)}`,
    `L ${centerLeft} ${cy + (waist / 2)}`,
    `C ${leftControlX} ${cy + (waist / 2)} ${leftShoulderX + 5} ${cy + (leftShoulderDia / 2)} ${leftShoulderX} ${cy + (leftShoulderDia / 2)}`,
    'Z'
  ];
  return [...top, ...bottom].join(' ');
}

function sideCylinder(x, cy, width, dia, className, style, options = {}) {
  const chamfer = Math.min(options.chamfer ?? 2, width / 3, dia / 4);
  const r = dia / 2;
  const d = [
    `M ${x + chamfer} ${cy - r}`,
    `L ${x + width - chamfer} ${cy - r}`,
    `L ${x + width} ${cy - r + chamfer}`,
    `L ${x + width} ${cy + r - chamfer}`,
    `L ${x + width - chamfer} ${cy + r}`,
    `L ${x + chamfer} ${cy + r}`,
    `L ${x} ${cy + r - chamfer}`,
    `L ${x} ${cy - r + chamfer}`,
    'Z'
  ].join(' ');
  return path(d, bp(className, style));
}

function sideRing(x, cy, width, dia, className, style) {
  return sideCylinder(x, cy, width, dia, className, style, { chamfer: 1.2 });
}

function sideFlange(x, cy, dia, thickness, className, config, isLeft) {
  const groups = [];
  const x1 = x - (thickness / 2);
  const r = dia / 2;
  const cutoutStyle = config.hub.flangeCutoutStyle;
  const style = activeStyle(config);
  const flangeStyle = className.includes('right') ? style.flangeRight : style.flangeLeft;
  groups.push(sideRing(x1 - 1.2, cy, thickness + 2.4, dia + 4, `${className} hub-flange-rim`, flangeStyle));
  groups.push(sideRing(x1, cy, thickness, dia, `${className} hub-flange-plate`, flangeStyle));

  if (cutoutStyle === 'scalloped') {
    const count = 8;
    for (let index = 0; index < count; index += 1) {
      const y = cy - r + ((index + 0.5) * (dia / count));
      const h = Math.max(2.2, dia / 22);
      groups.push(rect(x1 - 1.7, y - (h / 2), thickness + 3.4, h, bp('hub-flange-scallop', style.cutout, { rx: 1.4 })));
    }
  } else if (cutoutStyle === 'lightening-slots') {
    [-0.28, 0.28].forEach((offset) => {
      groups.push(rect(x1 + 0.7, cy + (offset * dia) - 3, Math.max(1, thickness - 1.4), 6, {
        class: 'hub-flange-cutout',
        ...style.cutout,
        rx: 1
      }));
    });
  }

  const spokesPerSide = config.wheel.spokeCount / 2;
  const hubStep = (2 * Math.PI) / spokesPerSide;
  const angleOffset = isLeft ? 0 : hubStep / 2;
  for (let index = 0; index < spokesPerSide; index += 1) {
    const angle = (-Math.PI / 2) + (index * hubStep) + angleOffset;
    const holeY = cy + (r * Math.sin(angle));
    const apparentHeight = Math.max(0.4, Math.min(1.8, config.hub.spokeHoleDia * Math.abs(Math.cos(angle))));
    groups.push(rect(x - (thickness / 2) - 0.2, holeY - (apparentHeight / 2), thickness + 0.4, apparentHeight, {
      class: 'hub-spoke-hole-side',
      ...style.hole
    }));
  }

  return groups.join('');
}

function renderEndcapStack(x, cy, direction, config) {
  const style = activeStyle(config);
  const endcapLength = config.hub.endcapLength;
  const endcapDia = config.hub.endcapDia;
  const sign = direction === 'left' ? 1 : -1;
  const start = direction === 'left' ? x - 2 : x - endcapLength + 2;
  const innerX = direction === 'left' ? x + endcapLength - 3 : x - endcapLength + 3;
  const groups = [
    sideCylinder(start, cy, endcapLength - 2, endcapDia, 'hub-endcap', style.endcap, { chamfer: 1.5 }),
    sideCylinder(start + (direction === 'left' ? 1 : endcapLength - 8), cy, 6, endcapDia - 5, 'hub-axle-tip', style.axle, { chamfer: 1.2 })
  ];
  if (isBlueprint(config)) {
    groups.push(line(innerX, cy - (endcapDia / 2) - 3, innerX + (sign * 8), cy - (endcapDia / 2) - 3, {
      class: 'hub-blueprint-line',
      ...style.line
    }));
    groups.push(line(innerX, cy + (endcapDia / 2) + 3, innerX + (sign * 8), cy + (endcapDia / 2) + 3, {
      class: 'hub-blueprint-line',
      ...style.line
    }));
  }
  return groups.join('');
}

function renderCenterlockSide(x, cy, width, dia, style) {
  const groups = [];
  groups.push(sideCylinder(x, cy, width, dia, 'hub-brake-mount hub-centerlock-side', style.mount, { chamfer: 1.2 }));
  const toothCount = 16;
  const toothStep = dia / toothCount;
  for (let index = 0; index < toothCount; index += 1) {
    const y = cy - (dia / 2) + (index * toothStep);
    groups.push(line(x + 1.2, y + 0.8, x + width - 1.2, y + toothStep - 0.8, bp('hub-centerlock-tooth', style.detail)));
  }
  groups.push(sideRing(x + width + 1, cy, 2.2, dia + 5, 'hub-centerlock-lockring-side', style.bearing));
  return groups.join('');
}

function renderSixBoltSide(x, cy, width, dia, style) {
  const groups = [];
  groups.push(sideRing(x, cy, width, dia, 'hub-brake-mount hub-sixbolt-side', style.mount));
  groups.push(sideRing(x + width + 1, cy, 2.6, dia + 4, 'hub-sixbolt-shoulder', style.bearing));
  return groups.join('');
}

function renderFreehubSide(x, cy, width, dia, config) {
  const style = activeStyle(config);
  const groups = [];
  const type = config.hub.freehubType || 'hg';
  const isXd = type === 'xd';
  const shoulderDia = dia + (isXd ? 3 : 5);
  const bodyDia = isXd ? dia - 2 : dia;
  groups.push(sideRing(x - 4.2, cy, 4.2, shoulderDia, 'hub-freehub-inner-shoulder', style.bearing));

  if (isXd) {
    const splineWidth = Math.min(7, width * 0.22);
    const threadStart = x + splineWidth;
    const threadWidth = Math.min(5.5, width * 0.18);
    const threadEnd = threadStart + threadWidth;
    const finalStepX = Math.max(threadEnd + 1, x + width - 8 - 5);
    const splineRadius = bodyDia / 2;
    const threadRadius = splineRadius - 1;
    const smoothRadius = splineRadius - 2;
    const endRadius = splineRadius - 3;
    const d = [
      `M ${x} ${cy - splineRadius}`,
      `L ${x + splineWidth} ${cy - splineRadius}`,
      `L ${x + splineWidth} ${cy - threadRadius}`,
      `L ${threadEnd} ${cy - threadRadius}`,
      `L ${threadEnd} ${cy - smoothRadius}`,
      `L ${finalStepX} ${cy - smoothRadius}`,
      `L ${finalStepX} ${cy - endRadius}`,
      `L ${x + width - 8} ${cy - endRadius}`,
      `L ${x + width - 8} ${cy + endRadius}`,
      `L ${finalStepX} ${cy + endRadius}`,
      `L ${finalStepX} ${cy + smoothRadius}`,
      `L ${threadEnd} ${cy + smoothRadius}`,
      `L ${threadEnd} ${cy + threadRadius}`,
      `L ${x + splineWidth} ${cy + threadRadius}`,
      `L ${x + splineWidth} ${cy + splineRadius}`,
      `L ${x} ${cy + splineRadius}`,
      'Z'
    ].join(' ');
    groups.push(path(d, bp(`hub-cylinder-freehub hub-freehub-${type}`, style.freehub)));
    for (let xLine = threadStart + 0.7; xLine < threadStart + threadWidth; xLine += 1.2) {
      groups.push(line(xLine, cy - threadRadius + 1, xLine, cy + threadRadius - 1, bp('hub-freehub-thread-line', style.detail)));
    }
    const ribCount = 6;
    const ribSpacing = bodyDia / (ribCount + 1);
    for (let index = 1; index <= ribCount; index += 1) {
      const y = cy - (bodyDia / 2) + (index * ribSpacing);
      groups.push(line(x + 0.8, y, x + splineWidth, y, bp('hub-freehub-spline', style.detail)));
    }
    return groups.join('');
  }

  groups.push(sideCylinder(x, cy, width - 8, bodyDia, `hub-cylinder-freehub hub-freehub-${type}`, style.freehub, { chamfer: 2.2 }));
  groups.push(sideCylinder(x + width - 8, cy, 5, bodyDia - 5, 'hub-freehub-thread-step', style.bearing, { chamfer: 1.4 }));
  groups.push(sideCylinder(x + width - 3.5, cy, 3.5, bodyDia - 10, 'hub-freehub-end-bore', style.axle, { chamfer: 1.1 }));
  const ribCount = type === 'microspline' ? 12 : 10;
  const ribSpacing = bodyDia / (ribCount + 1);
  const indexStep = type === 'hg' ? 2 : 1;
  for (let index = 1; index <= ribCount; index += indexStep) {
    const y = cy - (bodyDia / 2) + (index * ribSpacing);
    const inset = index % 2 === 0 && type.includes('hg') ? 5 : 3.5;
    groups.push(line(x + inset, y, x + width - 11, y, bp('hub-freehub-spline', style.detail)));
  }
  return groups.join('');
}

function contiguousPath(x1, x2, cy, r, chamfer = 1.5) {
  return [
    `M ${x1 + chamfer} ${cy - r}`,
    `L ${x2 - chamfer} ${cy - r}`,
    `L ${x2} ${cy - r + chamfer}`,
    `L ${x2} ${cy + r - chamfer}`,
    `L ${x2 - chamfer} ${cy + r}`,
    `L ${x1 + chamfer} ${cy + r}`,
    `L ${x1} ${cy + r - chamfer}`,
    `L ${x1} ${cy - r + chamfer}`,
    'Z'
  ].join(' ');
}

function endcapPath(x1, x2, cy, r, side, chamfer = 1.5) {
  if (side === 'left') {
    return [
      `M ${x1 + chamfer} ${cy - r}`,
      `L ${x2} ${cy - r}`,
      `L ${x2} ${cy + r}`,
      `L ${x1 + chamfer} ${cy + r}`,
      `L ${x1} ${cy + r - chamfer}`,
      `L ${x1} ${cy - r + chamfer}`,
      'Z'
    ].join(' ');
  }
  return [
    `M ${x1} ${cy - r}`,
    `L ${x2 - chamfer} ${cy - r}`,
    `L ${x2} ${cy - r + chamfer}`,
    `L ${x2} ${cy + r - chamfer}`,
    `L ${x2 - chamfer} ${cy + r}`,
    `L ${x1} ${cy + r}`,
    'Z'
  ].join(' ');
}

function centeredYs(cy, radius, count) {
  return Array.from({ length: count }, (_, index) => (
    cy - radius + (((index + 1) * radius * 2) / (count + 1))
  ));
}

function renderCenterlockFaceRings(cx, cy, style) {
  return [
    circle(cx, cy, 17, {
      class: 'hub-centerlock-solid-ring',
      fill: 'none',
      stroke: style.detail.stroke,
      'stroke-width': 1
    }),
    circle(cx, cy, 17.5, {
      class: 'hub-centerlock-dashed-ring',
      fill: 'none',
      stroke: style.detail.stroke,
      'stroke-width': 1,
      'stroke-dasharray': '1 1'
    })
  ].join('');
}

function renderFreehubFace(cx, cy, config, style) {
  if (config.hub.freehubType === 'microspline') {
    return path(createMicrosplineFreehubFacePath(cx, cy), bp('hub-cylinder-freehub hub-freehub-microspline-face', style.freehub));
  }
  if (config.hub.freehubType === 'xd') {
    return [
      path(createXDFreehubFacePath(cx, cy), bp('hub-cylinder-freehub hub-freehub-xd-face', style.freehub)),
      circle(cx, cy, 13.5, {
        class: 'hub-freehub-xd-middle-ring',
        fill: 'none',
        stroke: style.detail.stroke,
        'stroke-width': 1,
        'stroke-dasharray': '1 1'
      }),
      circle(cx, cy, 11.5, {
        class: 'hub-freehub-xd-center-ring',
        fill: 'none',
        stroke: style.detail.stroke,
        'stroke-width': 1
      })
    ].join('');
  }
  return path(createHGFreehubFacePath(cx, cy), bp('hub-cylinder-freehub hub-freehub-hg-face', style.freehub));
}

function sideFacePaint(style, side) {
  return side === 'left' ? style.flangeLeft : style.flangeRight;
}

function sideFaceClass(side) {
  return side === 'left' ? 'hub-flange-left' : 'hub-flange-right';
}

function renderContiguousHubSideGroup(cx, cy, config) {
  const style = activeStyle(config);
  const old = config.hub.builtInDimension || (config.hub.hubPosition === 'front' ? 100 : 142);
  const leftEndX = cx - (old / 2);
  const rightEndX = cx + (old / 2);
  const endcapLength = config.hub.endcapLength || 8;
  const endcapRadius = (config.hub.endcapDia || 18) / 2;
  const hasBrakeMount = config.hub.brakeType !== 'rim';
  const brakeWidth = hasBrakeMount ? (config.hub.brakeMountWidth ?? 5) : 0;
  const brakeCoreRadius = hasBrakeMount ? Math.max(15, Math.min(config.hub.brakeMountDia / 2, 18)) : Math.max(12, config.hub.shellBodyDia / 2);
  const freehubLength = config.hub.hubPosition === 'rear' ? config.hub.freehubLength : 0;
  const freehubRadius = (config.hub.freehubDia || 34) / 2;
  const leftFlangeX = cx - config.hub.leftFlangeCenter;
  const rightFlangeX = cx + config.hub.rightFlangeCenter;
  const flangeThickness = (config.hub.flangeThickness || 4) * (config.hub.hubType === 'straightpull' ? 1.5 : 1);
  const leftFlangeRadius = config.hub.leftFlangeDia / 2;
  const rightFlangeRadius = config.hub.rightFlangeDia / 2;
  const shellRadius = Math.max(12, config.hub.shellWaistDia / 2);
  const freehubType = config.hub.freehubType || 'hg';
  const isXd = freehubType === 'xd';

  const xBrakeStart = leftEndX + endcapLength;
  const xBrakeEnd = hasBrakeMount
    ? Math.min(xBrakeStart + brakeWidth, leftFlangeX - (flangeThickness / 2) - 2)
    : xBrakeStart;
  const xLeftFlange1 = leftFlangeX - (flangeThickness / 2);
  const xLeftFlange2 = leftFlangeX + (flangeThickness / 2);
  const xRightFlange1 = rightFlangeX - (flangeThickness / 2);
  const xRightFlange2 = rightFlangeX + (flangeThickness / 2);
  const xRightEndcapStart = rightEndX - endcapLength;
  const xFreehubStart = Math.max(xRightEndcapStart - freehubLength, xRightFlange2 + 2);
  const xdSplineWidth = isXd ? Math.min(7, freehubLength * 0.22) : 0;
  const xdThreadWidth = isXd ? Math.min(5.5, freehubLength * 0.18) : 0;
  const xXdSplineEnd = xFreehubStart + xdSplineWidth;
  const xXdThreadEnd = xXdSplineEnd + xdThreadWidth;
  const xXdFinalStep = isXd ? Math.max(xXdThreadEnd + 1, xRightEndcapStart - 5) : xRightEndcapStart;
  const xdSplineRadius = freehubRadius;
  const xdThreadRadius = freehubRadius - 1;
  const xdSmoothRadius = freehubRadius - 2;
  const xdEndRadius = freehubRadius - 3;
  const flangeStickOut = Math.max(0, config.hub.flangeStickOut || 0);
  const leftAttachRadius = Math.max(shellRadius, leftFlangeRadius - flangeStickOut);
  const rightAttachRadius = Math.max(shellRadius, rightFlangeRadius - flangeStickOut);
  const centerRadius = Math.max(8, (config.hub.centerShellDia || config.hub.shellWaistDia) / 2);
  const curveDrama = Math.max(0.1, Math.min(1, config.hub.curveDrama || 0.35));
  const leftSpan = Math.max(1, cx - xLeftFlange2);
  const rightSpan = Math.max(1, xRightFlange1 - cx);
  const cpLeftX1 = xLeftFlange2 + (leftSpan * curveDrama);
  const cpLeftX2 = cx - (leftSpan * curveDrama);
  const cpRightX1 = cx + (rightSpan * curveDrama);
  const cpRightX2 = xRightFlange1 - (rightSpan * curveDrama);

  const leftEndcapPath = endcapPath(leftEndX, xBrakeStart, cy, endcapRadius, 'left', 1.5);
  const rightEndcapPath = endcapPath(xRightEndcapStart, rightEndX, cy, endcapRadius, 'right', 1.5);
  const leftFlangePath = contiguousPath(xLeftFlange1, xLeftFlange2, cy, leftFlangeRadius, Math.min(1.2, flangeThickness / 3));
  const rightFlangePath = contiguousPath(xRightFlange1, xRightFlange2, cy, rightFlangeRadius, Math.min(1.2, flangeThickness / 3));
  const brakePath = contiguousPath(xBrakeStart, xBrakeEnd, cy, brakeCoreRadius, 1.2);
  const shellPath = [
    `M ${xBrakeEnd} ${cy - brakeCoreRadius}`,
    `C ${xBrakeEnd + 4} ${cy - brakeCoreRadius} ${xLeftFlange1 - 5} ${cy - leftAttachRadius} ${xLeftFlange1} ${cy - leftAttachRadius}`,
    `L ${xLeftFlange2} ${cy - leftAttachRadius}`,
    `C ${cpLeftX1} ${cy - leftAttachRadius} ${cpLeftX2} ${cy - centerRadius} ${cx} ${cy - centerRadius}`,
    `C ${cpRightX1} ${cy - centerRadius} ${cpRightX2} ${cy - rightAttachRadius} ${xRightFlange1} ${cy - rightAttachRadius}`,
    `L ${xRightFlange2} ${cy - rightAttachRadius}`,
    `C ${xRightFlange2 + 4} ${cy - rightFlangeRadius} ${xFreehubStart - 4} ${cy - freehubRadius} ${xFreehubStart} ${cy - freehubRadius}`,
    `L ${xFreehubStart} ${cy + freehubRadius}`,
    `C ${xFreehubStart - 4} ${cy + freehubRadius} ${xRightFlange2 + 4} ${cy + rightFlangeRadius} ${xRightFlange2} ${cy + rightFlangeRadius}`,
    `L ${xRightFlange1} ${cy + rightAttachRadius}`,
    `C ${cpRightX2} ${cy + rightAttachRadius} ${cpRightX1} ${cy + centerRadius} ${cx} ${cy + centerRadius}`,
    `C ${cpLeftX2} ${cy + centerRadius} ${cpLeftX1} ${cy + leftAttachRadius} ${xLeftFlange2} ${cy + leftAttachRadius}`,
    `L ${xLeftFlange1} ${cy + leftAttachRadius}`,
    `C ${xLeftFlange1 - 5} ${cy + leftAttachRadius} ${xBrakeEnd + 4} ${cy + brakeCoreRadius} ${xBrakeEnd} ${cy + brakeCoreRadius}`,
    'Z'
  ].join(' ');
  const freehubPath = isXd
    ? [
      `M ${xFreehubStart} ${cy - xdSplineRadius}`,
      `L ${xXdSplineEnd} ${cy - xdSplineRadius}`,
      `L ${xXdSplineEnd} ${cy - xdThreadRadius}`,
      `L ${xXdThreadEnd} ${cy - xdThreadRadius}`,
      `L ${xXdThreadEnd} ${cy - xdSmoothRadius}`,
      `L ${xXdFinalStep} ${cy - xdSmoothRadius}`,
      `L ${xXdFinalStep} ${cy - xdEndRadius}`,
      `L ${xRightEndcapStart} ${cy - xdEndRadius}`,
      `L ${xRightEndcapStart} ${cy + xdEndRadius}`,
      `L ${xXdFinalStep} ${cy + xdEndRadius}`,
      `L ${xXdFinalStep} ${cy + xdSmoothRadius}`,
      `L ${xXdThreadEnd} ${cy + xdSmoothRadius}`,
      `L ${xXdThreadEnd} ${cy + xdThreadRadius}`,
      `L ${xXdSplineEnd} ${cy + xdThreadRadius}`,
      `L ${xXdSplineEnd} ${cy + xdSplineRadius}`,
      `L ${xFreehubStart} ${cy + xdSplineRadius}`,
      'Z'
    ].join(' ')
    : [
      `M ${xFreehubStart} ${cy - freehubRadius}`,
      `L ${xRightEndcapStart} ${cy - freehubRadius}`,
      `L ${xRightEndcapStart} ${cy + freehubRadius}`,
      `L ${xFreehubStart} ${cy + freehubRadius}`,
      'Z'
    ].join(' ');
  const maskId = `hub-mask-${String(config.hub.preset || 'custom').replaceAll(/[^a-z0-9-]/gi, '-')}-${config.style.hubRenderStyle || 'blueprint'}`;
  const components = [
    path(leftEndcapPath, bp('hub-endcap', style.endcap)),
    hasBrakeMount ? path(brakePath, bp(`hub-brake-mount hub-${config.hub.brakeType}-side`, style.mount)) : '',
    path(shellPath, bp('hub-cylinder hub-shell-body', style.shell)),
    path(leftFlangePath, bp('hub-flange-left hub-flange-plate', style.flangeLeft)),
    path(rightFlangePath, bp('hub-flange-right hub-flange-plate', style.flangeRight)),
    path(freehubPath, bp(`hub-cylinder-freehub hub-freehub-${freehubType}`, style.freehub)),
    path(rightEndcapPath, bp('hub-endcap', style.endcap))
  ];
  const details = [];

  if (config.style.hubRenderStyle === 'realistic') {
    details.push(tag('defs', {}, tag('clipPath', { id: maskId }, [
      tag('path', { d: leftEndcapPath }, ''),
      hasBrakeMount ? tag('path', { d: brakePath }, '') : '',
      tag('path', { d: shellPath }, ''),
      tag('path', { d: leftFlangePath }, ''),
      tag('path', { d: rightFlangePath }, ''),
      tag('path', { d: freehubPath }, ''),
      tag('path', { d: rightEndcapPath }, '')
    ].join(''))));
  }

  if (config.hub.hubType === 'straightpull') {
    const slotCount = Math.max(1, Math.round(config.wheel.spokeCount / 4));
    [
      [xLeftFlange1, xLeftFlange2, leftFlangeRadius],
      [xRightFlange1, xRightFlange2, rightFlangeRadius]
    ].forEach(([x1, x2, r]) => {
      centeredYs(cy, r, slotCount).forEach((y) => {
        details.push(line(x1 + 0.6, y, x2 - 0.6, y, bp('hub-straightpull-slot-side', style.detail, { opacity: 0.72, 'stroke-width': 0.8 })));
      });
    });
  }
  if (config.hub.brakeType === '6bolt') {
    centeredYs(cy, brakeCoreRadius, 2).forEach((y) => {
      details.push(line(xBrakeStart + 0.7, y, xBrakeEnd - 0.7, y, bp('hub-sixbolt-side-line', style.detail, { opacity: 0.65, 'stroke-width': 0.75 })));
    });
  }
  if (config.hub.brakeType === 'centerlock') {
    for (let x = xBrakeStart + 1.5; x < xBrakeEnd; x += 1.6) {
      details.push(line(x, cy - brakeCoreRadius + 1, x, cy + brakeCoreRadius - 1, bp('hub-centerlock-tooth', style.detail, { opacity: 0.55, 'stroke-width': 0.55 })));
    }
  }
  if (isXd) {
    for (let x = xXdSplineEnd + 0.7; x < xXdThreadEnd; x += 1.2) {
      details.push(line(x, cy - xdThreadRadius + 1, x, cy + xdThreadRadius - 1, bp('hub-freehub-thread-line', style.detail, { opacity: 0.45, 'stroke-width': 0.55 })));
    }
    centeredYs(cy, xdSplineRadius, 6).forEach((y) => {
      details.push(line(xFreehubStart + 0.8, y, xXdSplineEnd, y, bp('hub-freehub-spline', style.detail, { opacity: 0.7, 'stroke-width': 0.75 })));
    });
    details.push(line(xXdFinalStep, cy - xdSmoothRadius, xXdFinalStep, cy + xdSmoothRadius, bp('hub-freehub-final-step-line', style.detail, { opacity: 0.5, 'stroke-width': 0.65 })));
  } else {
    const splineCount = freehubType === 'microspline' ? 9 : 4;
    centeredYs(cy, freehubRadius, splineCount).forEach((y) => {
      details.push(line(xFreehubStart, y, xRightEndcapStart - 1, y, bp('hub-freehub-spline', style.detail, { opacity: 0.7, 'stroke-width': 0.75 })));
    });
  }
  if (isBlueprint(config)) {
    details.push(line(leftEndX, cy + 55, leftEndX, cy + 65, bp('hub-blueprint-line', style.line)));
    details.push(line(rightEndX, cy + 55, rightEndX, cy + 65, bp('hub-blueprint-line', style.line)));
  }

  return tag('g', { class: hubProfileClass(config), 'data-hub-preset': config.hub.preset }, [...components, ...details].join(''));
}

export function renderHubSideGroup(cx, cy, config) {
  return renderContiguousHubSideGroup(cx, cy, config);
}

export class HubSVGGenerator {
  renderFace(options = {}) {
    const config = normalizeOptions(options);
    const style = activeStyle(config);
    const center = 75;
    const isLeft = config.view.hubFaceSide !== 'right';
    const frontSide = isLeft ? 'left' : 'right';
    const backSide = isLeft ? 'right' : 'left';
    const frontRadius = isLeft ? config.hub.leftFlangeDia / 2 : config.hub.rightFlangeDia / 2;
    const backRadius = isLeft ? config.hub.rightFlangeDia / 2 : config.hub.leftFlangeDia / 2;
    const spokesPerSide = config.wheel.spokeCount / 2;
    const hubStep = (2 * Math.PI) / spokesPerSide;
    const frontHoles = [];
    const backHoles = [];

    for (let index = 0; index < spokesPerSide; index += 1) {
      const leftAngle = (-Math.PI / 2) + (index * hubStep);
      const rightAngle = leftAngle + (hubStep / 2);
      if (isLeft) {
        frontHoles.push(polar(center, center, frontRadius, leftAngle));
        backHoles.push(polar(center, center, backRadius, rightAngle));
      } else {
        frontHoles.push(polar(center, center, frontRadius, rightAngle));
        backHoles.push(polar(center, center, backRadius, leftAngle));
      }
    }

    const content = [];
    if (!isLeft && config.hub.brakeType === '6bolt') {
      content.push(path(create6BoltPath(center, center), bp('hub-brake-mount', style.mount)));
    } else if (!isLeft && config.hub.brakeType === 'centerlock') {
      content.push(renderCenterlockFaceRings(center, center, style));
    }

    if (config.hub.hubType === 'straightpull') {
      content.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), bp(sideFaceClass(backSide), sideFacePaint(style, backSide))));
      content.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), bp(sideFaceClass(frontSide), sideFacePaint(style, frontSide))));
    } else {
      const showHoles = config.hub.showHubHoles === 'visible';
      content.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, showHoles), bp(sideFaceClass(backSide), sideFacePaint(style, backSide))));
      content.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, showHoles), bp(sideFaceClass(frontSide), sideFacePaint(style, frontSide))));
      if (config.hub.flangeCutoutStyle === 'scalloped') {
        const scallopCount = Math.max(6, Math.floor(spokesPerSide / 2));
        for (let index = 0; index < scallopCount; index += 1) {
          const cut = polar(center, center, frontRadius * 0.72, (-Math.PI / 2) + (index * ((2 * Math.PI) / scallopCount)));
          content.push(circle(cut.x, cut.y, 2.7, bp('hub-flange-cutout', style.cutout)));
        }
      }
    }

    if (config.hub.hubPosition === 'rear' && !isLeft) {
      content.push(renderFreehubFace(center, center, config, style));
    }
    if (isLeft && config.hub.brakeType === '6bolt') {
      content.push(path(create6BoltPath(center, center), bp('hub-brake-mount', style.mount)));
    } else if (isLeft && config.hub.brakeType === 'centerlock') {
      content.push(renderCenterlockFaceRings(center, center, style));
    }

    return svgDocument(150, 150, '0 0 150 150', tag('g', {
      class: `hub-face-group hub-brand-${config.hub.brandStyle || 'generic'} hub-render-${config.style.hubRenderStyle || 'blueprint'}`
    }, content.join('')), visualizerStyle(config.style), {
      class: 'hub-svg'
    });
  }

  renderSide(options = {}) {
    const config = normalizeOptions(options);
    return svgDocument(200, 150, '0 0 200 150', renderHubSideGroup(100, 75, config), visualizerStyle(config.style), {
      class: 'hub-svg'
    });
  }

  hubHoles(options = {}) {
    return hubHolePositions(options);
  }
}
