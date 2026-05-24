import { hubHolePositions, lacingMap, normalizeOptions, rimHolePositions } from './math.js';
import {
  circle,
  create6BoltPath,
  createHGFreehubFacePath,
  createJBendFlangePath,
  createMicrosplineFreehubFacePath,
  createStraightPullFlangePath,
  createXDFreehubFacePath,
  path,
  renderValve,
  spokeNipple
} from './paths.js';
import { line, svgDocument, tag, visualizerStyle } from './svg.js';
import { paintValue } from './styles.js';

function pointAlongSpoke(hubPoint, rimPoint, distance) {
  const dx = rimPoint.x - hubPoint.x;
  const dy = rimPoint.y - hubPoint.y;
  const length = Math.hypot(dx, dy) || 1;
  const unitX = dx / length;
  const unitY = dy / length;
  return {
    x: hubPoint.x + (unitX * distance),
    y: hubPoint.y + (unitY * distance)
  };
}

function straightPullOffset(config, side) {
  const raw = side === 'right' ? config.hub.spokeOffsetDs : config.hub.spokeOffsetNds;
  return Number.isFinite(raw) ? raw : 0;
}

function straightPullSpokeHead(hubPoint, rimPoint, spoke, config) {
  const offsetPoint = pointAlongSpoke(hubPoint, rimPoint, straightPullOffset(config, spoke.side));
  const angle = Math.atan2(hubPoint.y - rimPoint.y, hubPoint.x - rimPoint.x) * (180 / Math.PI);
  const spokeWidth = 2;
  const halfWidth = spokeWidth / 2;
  const arcRadius = halfWidth;
  const arcHalfChord = arcRadius / Math.SQRT2;
  const arcX = spokeWidth - arcHalfChord;
  const d = [
    `M 0 ${-halfWidth}`,
    `L ${arcX} ${-arcHalfChord}`,
    `A ${arcRadius} ${arcRadius} 0 0 1 ${arcX} ${arcHalfChord}`,
    `L 0 ${halfWidth}`,
    'Z'
  ].join(' ');
  return path(d, {
    class: `straight-pull-spoke-head spoke-${spoke.side} spoke-${spoke.type}`,
    transform: `translate(${offsetPoint.x} ${offsetPoint.y}) rotate(${angle})`,
    style: 'stroke: transparent; stroke-width: 0;',
    'data-wheel-component': 'straight-pull-spoke-head',
    'data-spoke-side': spoke.side,
    'data-spoke-type': spoke.type,
    'data-rim-index': spoke.rimIndex,
    'data-hub-index': spoke.hubIndex
  });
}

function renderCenterlockFaceRings(cx, cy, config) {
  return [
    circle(cx, cy, 17, {
      class: 'hub-centerlock-solid-ring',
      fill: 'none',
      stroke: paintValue(config.style, 'hubDetailStroke'),
      'stroke-width': 1
    }),
    circle(cx, cy, 17.5, {
      class: 'hub-centerlock-dashed-ring',
      fill: 'none',
      stroke: paintValue(config.style, 'hubDetailStroke'),
      'stroke-width': 1,
      'stroke-dasharray': '1 1'
    })
  ].join('');
}

function renderFreehubFace(cx, cy, config) {
  if (config.hub.freehubType === 'microspline') {
    return path(createMicrosplineFreehubFacePath(cx, cy), { class: 'hub-cylinder-freehub hub-freehub-microspline-face' });
  }
  if (config.hub.freehubType === 'xd') {
    return [
      path(createXDFreehubFacePath(cx, cy), { class: 'hub-cylinder-freehub hub-freehub-xd-face' }),
      circle(cx, cy, 13.5, {
        class: 'hub-freehub-xd-middle-ring',
        fill: 'none',
        stroke: paintValue(config.style, 'hubDetailStroke'),
        'stroke-width': 1,
        'stroke-dasharray': '1 1'
      }),
      circle(cx, cy, 11.5, {
        class: 'hub-freehub-xd-center-ring',
        fill: 'none',
        stroke: paintValue(config.style, 'hubDetailStroke'),
        'stroke-width': 1
      })
    ].join('');
  }
  return path(createHGFreehubFacePath(cx, cy), { class: 'hub-cylinder-freehub hub-freehub-hg-face' });
}

function sideFaceClass(side) {
  return side === 'left' ? 'hub-flange-left' : 'hub-flange-right';
}

export class WheelFaceSVGGenerator {
  render(options = {}) {
    const config = normalizeOptions(options);
    const canvasSize = Math.max(700, Math.ceil(config.wheel.outerDia + 48));
    const center = canvasSize / 2;
    const outerRadius = config.wheel.outerDia / 2;
    const innerRadius = config.wheel.erd / 2;
    const rimThickness = outerRadius - innerRadius;
    const rimMidRadius = innerRadius + (rimThickness / 2);
    const rimHoles = rimHolePositions(config, { center, radius: innerRadius });
    const hubHoles = hubHolePositions(config, { center });
    const lacing = lacingMap(config);
    const isLeftView = config.view.wheelFaceSide !== 'right';
    const frontSide = isLeftView ? 'left' : 'right';
    const backSide = isLeftView ? 'right' : 'left';
    const frontRadius = isLeftView ? config.hub.leftFlangeDia / 2 : config.hub.rightFlangeDia / 2;
    const backRadius = isLeftView ? config.hub.rightFlangeDia / 2 : config.hub.leftFlangeDia / 2;
    const frontHoles = isLeftView ? hubHoles.left : hubHoles.right;
    const backHoles = isLeftView ? hubHoles.right : hubHoles.left;
    const backSpokes = [];
    const frontSpokes = [];
    const backNipples = [];
    const frontNipples = [];
    const backNippleDots = [];
    const frontNippleDots = [];
    const backHubHeads = [];
    const frontHubHeads = [];

    lacing.forEach((spoke, spokeOrder) => {
      const hubPoint = hubHoles[spoke.side][spoke.hubIndex];
      const rimPoint = rimHoles[spoke.rimIndex];
      const spokeStart = config.hub.hubType === 'straightpull'
        ? pointAlongSpoke(hubPoint, rimPoint, straightPullOffset(config, spoke.side))
        : hubPoint;
      const isBackFlange = (spoke.side === 'left' && !isLeftView) || (spoke.side === 'right' && isLeftView);
      const isFront = config.style.spokeLayering === 'flat' ? true : !isBackFlange;
      const spokeSvg = line(spokeStart.x, spokeStart.y, rimPoint.x, rimPoint.y, {
        class: `spoke wheel-spoke spoke-${spoke.side} spoke-${spoke.type}${config.hub.hubType === 'straightpull' ? ' straight-pull-wheel-spoke' : ''}`,
        'data-wheel-component': 'spoke',
        'data-spoke-number': spokeOrder + 1,
        'data-spoke-side': spoke.side,
        'data-spoke-type': spoke.type,
        'data-rim-index': spoke.rimIndex,
        'data-hub-index': spoke.hubIndex
      });
      (isFront ? frontSpokes : backSpokes).push(spokeSvg);
      if (config.hub.hubType === 'straightpull') {
        (isFront ? frontHubHeads : backHubHeads).push(straightPullSpokeHead(hubPoint, rimPoint, spoke, config));
      }
      if (config.style.nippleStyle === 'nipples') {
        const nipple = spokeNipple(hubPoint, rimPoint);
        const nippleSvg = line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: 'spoke-nipple' });
        (isFront ? frontNipples : backNipples).push(nippleSvg);
      } else if (config.style.nippleStyle === 'dots') {
        const dotSvg = circle(rimPoint.x, rimPoint.y, 2.2, { class: 'spoke-nipple-dot' });
        (isFront ? frontNippleDots : backNippleDots).push(dotSvg);
      }
    });

    const hubContent = [];
    if (!isLeftView && config.hub.brakeType === '6bolt') {
      hubContent.push(path(create6BoltPath(center, center), {
        class: 'hub-brake-mount',
        'data-hub-component': 'brake-mount'
      }));
    } else if (!isLeftView && config.hub.brakeType === 'centerlock') {
      hubContent.push(tag('g', { 'data-hub-component': 'brake-mount' }, renderCenterlockFaceRings(center, center, config)));
    }

    if (config.hub.hubType === 'straightpull') {
      hubContent.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), {
        class: sideFaceClass(backSide),
        'data-hub-component': `${backSide}-flange`
      }));
      hubContent.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), {
        class: sideFaceClass(frontSide),
        'data-hub-component': `${frontSide}-flange`
      }));
    } else {
      const showHoles = config.hub.showHubHoles === 'visible';
      hubContent.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, showHoles), {
        class: sideFaceClass(backSide),
        'data-hub-component': `${backSide}-flange`
      }));
      if (showHoles) {
        backHoles.forEach((point) => {
          hubContent.push(circle(point.x + 0.4, point.y + 0.4, 1.4, {
            fill: config.style.spokeColor === 'black' ? paintValue(config.style, 'spokeBlack') : paintValue(config.style, 'spokeSilver')
          }));
        });
      }
      hubContent.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, showHoles), {
        class: sideFaceClass(frontSide),
        'data-hub-component': `${frontSide}-flange`
      }));
    }

    if (config.hub.hubPosition === 'rear' && !isLeftView) {
      hubContent.push(tag('g', { 'data-hub-component': 'freehub' }, renderFreehubFace(center, center, config)));
    }
    if (isLeftView && config.hub.brakeType === '6bolt') {
      hubContent.push(path(create6BoltPath(center, center), {
        class: 'hub-brake-mount',
        'data-hub-component': 'brake-mount'
      }));
    } else if (isLeftView && config.hub.brakeType === 'centerlock') {
      hubContent.push(tag('g', { 'data-hub-component': 'brake-mount' }, renderCenterlockFaceRings(center, center, config)));
    }
    hubContent.push(circle(center, center, 9, {
      fill: 'none',
      stroke: paintValue(config.style, 'hubDetailStroke'),
      'stroke-width': 6,
      'data-hub-component': 'axle'
    }));

    const rim = tag('g', { id: 'rimGroup' }, [
      circle(center, center, rimMidRadius, {
        fill: 'transparent',
        stroke: paintValue(config.style, 'rimFaceFill'),
        'stroke-width': rimThickness
      }),
      circle(center, center, outerRadius, { class: 'rim-outline' }),
      circle(center, center, innerRadius, { class: 'rim-outline' }),
      circle(center, center, innerRadius + 1, { class: 'rim-highlight' })
    ].join(''));
    const rimHoleSvg = tag('g', { class: 'rim-holes-group' }, rimHoles.map((point) => (
      circle(point.x, point.y, 2.2, { class: 'rim-hole' })
    )).join(''));
    const foregroundHubHeads = config.hub.hubType === 'jbend' && config.hub.showHubHoles === 'visible'
      ? frontHoles.map((point) => circle(point.x + 0.4, point.y + 0.4, 1.4, {
        fill: config.style.spokeColor === 'black' ? paintValue(config.style, 'spokeBlack') : paintValue(config.style, 'spokeSilver')
      })).join('')
      : '';

    const content = [
      config.style.spokeLayering === '3d' ? tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-back-spokes` }, backSpokes.join('')) : '',
      config.style.spokeLayering === '3d' && backHubHeads.length ? tag('g', { class: `spoke-theme-${config.style.spokeColor} straight-pull-spoke-heads straight-pull-back-heads` }, backHubHeads.join('')) : '',
      config.style.spokeLayering === '3d' ? tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-back-nipples` }, backNipples.join('')) : '',
      tag('g', { class: 'wheel-hub-face-group', 'data-hub-component': 'hub-face' }, hubContent.join('')),
      tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-front-spokes` }, frontSpokes.join('')),
      frontHubHeads.length ? tag('g', { class: `spoke-theme-${config.style.spokeColor} straight-pull-spoke-heads straight-pull-front-heads` }, frontHubHeads.join('')) : '',
      tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-front-nipples` }, frontNipples.join('')),
      rim,
      config.style.spokeLayering === '3d' ? tag('g', { class: 'wheel-back-nipple-dots' }, backNippleDots.join('')) : '',
      tag('g', { class: 'wheel-front-nipple-dots' }, frontNippleDots.join('')),
      rimHoleSvg,
      foregroundHubHeads ? tag('g', { class: 'hub-spoke-heads-group' }, foregroundHubHeads) : '',
      renderValve(config, center, innerRadius)
    ].join('');
    const renderedContent = isLeftView
      ? content
      : tag('g', { transform: `translate(${canvasSize} 0) scale(-1 1)`, class: 'wheel-face-right-mirror' }, content);

    return svgDocument(canvasSize, canvasSize, `0 0 ${canvasSize} ${canvasSize}`, renderedContent, visualizerStyle(config.style), { class: 'wheel-svg' });
  }
}
