import { hubHolePositions, normalizeOptions, polar } from './math.js';
import {
  circle,
  create6BoltPath,
  createCenterlockPath,
  createHGFreehubFacePath,
  createJBendFlangePath,
  createJBendFlangeSidePath,
  createStraightPullFlangePath,
  path
} from './paths.js';
import { line, rect, svgDocument, tag, visualizerStyle } from './svg.js';

export function renderHubSideGroup(cx, cy, config) {
  const old = config.hub.hubPosition === 'front' ? 100 : 142;
  const leftFlangeDia = config.hub.leftFlangeDia;
  const rightFlangeDia = config.hub.rightFlangeDia;
  const leftCenter = config.hub.leftFlangeCenter;
  const rightCenter = config.hub.rightFlangeCenter;
  const leftEndX = cx - (old / 2);
  const rightEndX = cx + (old / 2);
  const leftFlangeX = cx - leftCenter;
  const rightFlangeX = cx + rightCenter;
  const leftFlangeTop = cy - (leftFlangeDia / 2) + 2;
  const rightFlangeTop = cy - (rightFlangeDia / 2) + 2;
  const waistTop = cy - 12;
  const groups = [];

  groups.push(rect(leftEndX, cy - 5, old, 10, { class: 'hub-cylinder-dark' }));
  groups.push(rect(leftEndX - 4, cy - 9, 8, 18, { class: 'hub-cylinder' }));
  groups.push(rect(rightEndX - 4, cy - 9, 8, 18, { class: 'hub-cylinder' }));

  let leftHardwareX = leftEndX + 6;
  let rightHardwareX = rightEndX - 6;
  if (config.hub.brakeType === '6bolt') {
    groups.push(rect(leftEndX + 6, cy - 22, 6, 44, { class: 'hub-brake-mount' }));
    leftHardwareX += 8;
  } else if (config.hub.brakeType === 'centerlock') {
    groups.push(rect(leftEndX + 6, cy - 24, 8, 48, { class: 'hub-brake-mount' }));
    for (let y = cy - 16; y < cy + 16; y += 3) {
      groups.push(line(leftEndX + 7, y, leftEndX + 13, y, { stroke: '#6c757d', 'stroke-width': 1 }));
    }
    leftHardwareX += 10;
  }

  if (config.hub.hubPosition === 'rear') {
    const freehubWidth = (rightEndX - 6) - rightHardwareX;
    groups.push(rect(rightHardwareX, cy - 17.5, freehubWidth, 35, { class: 'hub-cylinder-freehub' }));
    [-12, -7, -2, 3, 8, 13].forEach((offsetY) => {
      groups.push(line(rightHardwareX + 4, cy + offsetY, rightEndX - 10, cy + offsetY, {
        stroke: '#343a40',
        'stroke-width': 1
      }));
    });
    rightHardwareX -= 2;
  }

  const shellPath = [
    `M ${leftHardwareX} ${waistTop}`,
    `L ${leftFlangeX - 3} ${leftFlangeTop}`,
    `L ${leftFlangeX + 3} ${leftFlangeTop}`,
    `L ${leftFlangeX + 8} ${waistTop}`,
    `L ${rightFlangeX - 8} ${waistTop}`,
    `L ${rightFlangeX - 3} ${rightFlangeTop}`,
    `L ${rightFlangeX + 3} ${rightFlangeTop}`,
    `L ${rightHardwareX} ${waistTop}`,
    `L ${rightHardwareX} ${cy + 12}`,
    `L ${rightFlangeX + 3} ${cy + (rightFlangeDia / 2) - 2}`,
    `L ${rightFlangeX - 3} ${cy + (rightFlangeDia / 2) - 2}`,
    `L ${rightFlangeX - 8} ${cy + 12}`,
    `L ${leftFlangeX + 8} ${cy + 12}`,
    `L ${leftFlangeX + 3} ${cy + (leftFlangeDia / 2) - 2}`,
    `L ${leftFlangeX - 3} ${cy + (leftFlangeDia / 2) - 2}`,
    `L ${leftHardwareX} ${cy + 12}`,
    'Z'
  ].join(' ');
  groups.push(path(shellPath, { class: 'hub-cylinder' }));

  const spokesPerSide = config.wheel.spokeCount / 2;
  const hubStep = (2 * Math.PI) / spokesPerSide;
  if (config.hub.hubType === 'jbend') {
    groups.push(path(createJBendFlangeSidePath(leftFlangeX, cy, leftFlangeDia, spokesPerSide, hubStep, true), {
      class: 'hub-flange-left'
    }));
    groups.push(path(createJBendFlangeSidePath(rightFlangeX, cy, rightFlangeDia, spokesPerSide, hubStep, false), {
      class: 'hub-flange-right'
    }));
  } else {
    groups.push(rect(leftFlangeX - 2, cy - (leftFlangeDia / 2) - 4, 5, leftFlangeDia + 8, { class: 'hub-flange-left' }));
    groups.push(rect(rightFlangeX - 2, cy - (rightFlangeDia / 2) - 4, 5, rightFlangeDia + 8, { class: 'hub-flange-right' }));
  }

  return tag('g', { class: 'hub-side-group' }, groups.join(''));
}

export class HubSVGGenerator {
  renderFace(options = {}) {
    const config = normalizeOptions(options);
    const center = 75;
    const isLeft = config.view.hubFaceSide !== 'right';
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
    if (!isLeft && config.hub.brakeType === '6bolt') content.push(path(create6BoltPath(center, center), { class: 'hub-brake-mount' }));
    if (!isLeft && config.hub.brakeType === 'centerlock') content.push(path(createCenterlockPath(center, center), { class: 'hub-brake-mount' }));

    if (config.hub.hubType === 'straightpull') {
      content.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), { class: 'hub-flange-right' }));
      content.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), { class: 'hub-flange-left' }));
    } else {
      content.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, true), { class: 'hub-flange-right' }));
      content.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, true), { class: 'hub-flange-left' }));
    }

    if (config.hub.hubPosition === 'rear' && !isLeft) {
      content.push(path(createHGFreehubFacePath(center, center), { class: 'hub-cylinder-freehub' }));
    }
    if (isLeft && config.hub.brakeType === '6bolt') content.push(path(create6BoltPath(center, center), { class: 'hub-brake-mount' }));
    if (isLeft && config.hub.brakeType === 'centerlock') {
      content.push(path(createCenterlockPath(center, center), { class: 'hub-brake-mount' }));
      content.push(circle(center, center, 18, { fill: 'none', stroke: '#6c757d', 'stroke-width': 4, 'stroke-dasharray': '2 2' }));
      content.push(circle(center, center, 16, { fill: 'none', stroke: '#212529', 'stroke-width': 1 }));
    }
    content.push(circle(center, center, 9, { fill: 'none', stroke: '#212529', 'stroke-width': 6 }));

    return svgDocument(150, 150, '0 0 150 150', tag('g', { class: 'hub-face-group' }, content.join('')), visualizerStyle(), {
      class: 'hub-svg'
    });
  }

  renderSide(options = {}) {
    const config = normalizeOptions(options);
    return svgDocument(200, 150, '0 0 200 150', renderHubSideGroup(100, 75, config), visualizerStyle(), {
      class: 'hub-svg'
    });
  }

  hubHoles(options = {}) {
    return hubHolePositions(options);
  }
}
