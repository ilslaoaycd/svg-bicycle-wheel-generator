import { hubHolePositions, lacingMap, normalizeOptions, rimHolePositions } from './math.js';
import {
  circle,
  create6BoltPath,
  createCenterlockPath,
  createHGFreehubFacePath,
  createJBendFlangePath,
  createStraightPullFlangePath,
  path,
  renderValve,
  spokeNipple
} from './paths.js';
import { line, svgDocument, tag, visualizerStyle } from './svg.js';

export class WheelFaceSVGGenerator {
  render(options = {}) {
    const config = normalizeOptions(options);
    const center = 350;
    const outerRadius = config.wheel.outerDia / 2;
    const innerRadius = config.wheel.erd / 2;
    const rimThickness = outerRadius - innerRadius;
    const rimMidRadius = innerRadius + (rimThickness / 2);
    const rimHoles = rimHolePositions(config, { center, radius: innerRadius });
    const hubHoles = hubHolePositions(config, { center });
    const lacing = lacingMap(config);
    const isLeftView = config.view.wheelFaceSide !== 'right';
    const frontRadius = isLeftView ? config.hub.leftFlangeDia / 2 : config.hub.rightFlangeDia / 2;
    const backRadius = isLeftView ? config.hub.rightFlangeDia / 2 : config.hub.leftFlangeDia / 2;
    const frontHoles = isLeftView ? hubHoles.left : hubHoles.right;
    const backHoles = isLeftView ? hubHoles.right : hubHoles.left;
    const backSpokes = [];
    const frontSpokes = [];
    const backNipples = [];
    const frontNipples = [];

    lacing.forEach((spoke) => {
      const hubPoint = hubHoles[spoke.side][spoke.hubIndex];
      const rimPoint = rimHoles[spoke.rimIndex];
      const isBackFlange = (spoke.side === 'left' && !isLeftView) || (spoke.side === 'right' && isLeftView);
      const isFront = config.style.spokeLayering === 'flat' ? true : !isBackFlange;
      const spokeSvg = line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, {
        class: `spoke spoke-${spoke.side} spoke-${spoke.type}`,
        'data-rim-index': spoke.rimIndex,
        'data-hub-index': spoke.hubIndex
      });
      (isFront ? frontSpokes : backSpokes).push(spokeSvg);
      if (config.style.nippleStyle === 'nipples') {
        const nipple = spokeNipple(hubPoint, rimPoint);
        const nippleSvg = line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: 'spoke-nipple' });
        (isFront ? frontNipples : backNipples).push(nippleSvg);
      }
    });

    const hubContent = [];
    if (!isLeftView && config.hub.brakeType === '6bolt') hubContent.push(path(create6BoltPath(center, center), { class: 'hub-brake-mount' }));
    if (!isLeftView && config.hub.brakeType === 'centerlock') hubContent.push(path(createCenterlockPath(center, center), { class: 'hub-brake-mount' }));

    if (config.hub.hubType === 'straightpull') {
      hubContent.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), { class: 'hub-flange-right' }));
      hubContent.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), { class: 'hub-flange-left' }));
    } else {
      const showHoles = config.hub.showHubHoles === 'visible';
      hubContent.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, showHoles), { class: 'hub-flange-right' }));
      if (showHoles) {
        backHoles.forEach((point) => {
          hubContent.push(circle(point.x + 0.4, point.y + 0.4, 1.4, {
            fill: config.style.spokeColor === 'black' ? '#343a40' : '#ced4da'
          }));
        });
      }
      hubContent.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, showHoles), { class: 'hub-flange-left' }));
    }

    if (config.hub.hubPosition === 'rear' && !isLeftView) {
      hubContent.push(path(createHGFreehubFacePath(center, center), { class: 'hub-cylinder-freehub' }));
    }
    if (isLeftView && config.hub.brakeType === '6bolt') hubContent.push(path(create6BoltPath(center, center), { class: 'hub-brake-mount' }));
    if (isLeftView && config.hub.brakeType === 'centerlock') {
      hubContent.push(path(createCenterlockPath(center, center), { class: 'hub-brake-mount' }));
      hubContent.push(circle(center, center, 18, { fill: 'none', stroke: '#6c757d', 'stroke-width': 4, 'stroke-dasharray': '2 2' }));
      hubContent.push(circle(center, center, 16, { fill: 'none', stroke: '#212529', 'stroke-width': 1 }));
    }
    hubContent.push(circle(center, center, 9, { fill: 'none', stroke: '#212529', 'stroke-width': 6 }));

    const rim = tag('g', { id: 'rimGroup' }, [
      circle(center, center, rimMidRadius, {
        fill: 'transparent',
        stroke: '#343a40',
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
        fill: config.style.spokeColor === 'black' ? '#343a40' : '#ced4da'
      })).join('')
      : '';

    const content = [
      rim,
      config.style.spokeLayering === '3d' ? tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-back-spokes` }, backSpokes.join('')) : '',
      config.style.spokeLayering === '3d' ? tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-back-nipples` }, backNipples.join('')) : '',
      tag('g', { class: 'wheel-hub-face-group' }, hubContent.join('')),
      tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-front-spokes` }, frontSpokes.join('')),
      tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-front-nipples` }, frontNipples.join('')),
      rimHoleSvg,
      foregroundHubHeads ? tag('g', { class: 'hub-spoke-heads-group' }, foregroundHubHeads) : '',
      renderValve(config, center, innerRadius)
    ].join('');

    return svgDocument(700, 700, '0 0 700 700', content, visualizerStyle(), { class: 'wheel-svg' });
  }
}
