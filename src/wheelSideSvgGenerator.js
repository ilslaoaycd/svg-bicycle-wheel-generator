import { lacingMap, normalizeOptions } from './math.js';
import { renderHubSideGroup, } from './hubSvgGenerator.js';
import { circle, line, path, svgDocument, tag, visualizerStyle } from './svg.js';
import { spokeNipple } from './paths.js';

export class WheelSideSVGGenerator {
  render(options = {}) {
    const config = normalizeOptions(options);
    const cx = 100;
    const cy = 375;
    const rimCenter = cx + config.wheel.rimOffset;
    const outerRadius = config.wheel.outerDia / 2;
    const innerRadius = config.wheel.erd / 2;
    const leftHubRadius = config.hub.leftFlangeDia / 2;
    const rightHubRadius = config.hub.rightFlangeDia / 2;
    const leftHubX = cx - config.hub.leftFlangeCenter;
    const rightHubX = cx + config.hub.rightFlangeCenter;
    const rimDepth = (config.wheel.outerDia - config.wheel.erd) / 2;
    const width = config.wheel.rimWidth;
    const yOuterTop = cy - outerRadius;
    const yInnerTop = cy - innerRadius;
    const yMidTop = yOuterTop + (rimDepth / 2);
    const yOuterBottom = cy + outerRadius;
    const yInnerBottom = cy + innerRadius;
    const yMidBottom = yOuterBottom - (rimDepth / 2);
    const topPath = [
      `M ${rimCenter - (width / 2)} ${yOuterTop}`,
      `L ${rimCenter + (width / 2)} ${yOuterTop}`,
      `L ${rimCenter + (width / 2)} ${yMidTop}`,
      `L ${rimCenter + (width / 6)} ${yInnerTop}`,
      `L ${rimCenter - (width / 6)} ${yInnerTop}`,
      `L ${rimCenter - (width / 2)} ${yMidTop}`,
      'Z'
    ].join(' ');
    const bottomPath = [
      `M ${rimCenter - (width / 6)} ${yInnerBottom}`,
      `L ${rimCenter + (width / 6)} ${yInnerBottom}`,
      `L ${rimCenter + (width / 2)} ${yMidBottom}`,
      `L ${rimCenter + (width / 2)} ${yOuterBottom}`,
      `L ${rimCenter - (width / 2)} ${yOuterBottom}`,
      `L ${rimCenter - (width / 2)} ${yMidBottom}`,
      'Z'
    ].join(' ');
    const rimGroup = tag('g', { id: 'rimGroup' }, [
      path(topPath, { class: 'rim-body' }),
      path(bottomPath, { class: 'rim-body' })
    ].join(''));
    const hubGroup = renderHubSideGroup(cx, cy, config);

    if (config.style.spokeLayering === 'flat') {
      const spokes = [];
      const nipples = [];
      const nippleDots = [];
      const draw = (hubPoint, rimPoint, side) => {
        spokes.push(line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, { class: `spoke spoke-${side} spoke-pulling` }));
        if (config.style.nippleStyle === 'nipples') {
          const nipple = spokeNipple(hubPoint, rimPoint);
          nipples.push(line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: 'spoke-nipple' }));
        } else if (config.style.nippleStyle === 'dots') {
          nippleDots.push(circle(rimPoint.x, rimPoint.y, 1.7, { class: 'spoke-nipple-dot' }));
        }
      };
      draw({ x: leftHubX, y: cy - leftHubRadius }, { x: rimCenter, y: yInnerTop }, 'left');
      draw({ x: rightHubX, y: cy - rightHubRadius }, { x: rimCenter, y: yInnerTop }, 'right');
      draw({ x: leftHubX, y: cy + leftHubRadius }, { x: rimCenter, y: yInnerBottom }, 'left');
      draw({ x: rightHubX, y: cy + rightHubRadius }, { x: rimCenter, y: yInnerBottom }, 'right');
      return svgDocument(200, 750, '0 0 200 750', [
        tag('g', { class: `spoke-theme-${config.style.spokeColor}` }, spokes.join('')),
        hubGroup,
        tag('g', { class: `nipple-theme-${config.style.nippleColor}` }, nipples.join('')),
        rimGroup,
        tag('g', { class: 'wheel-nipple-dots' }, nippleDots.join(''))
      ].join(''), visualizerStyle(config.style), { class: 'wheel-svg' });
    }

    const spokesPerSide = config.wheel.spokeCount / 2;
    const rimStep = (2 * Math.PI) / config.wheel.spokeCount;
    const hubStep = (2 * Math.PI) / spokesPerSide;
    const safeCross = Math.floor(config.lacing.crossPattern);
    const patternShift = (safeCross % 2 === 0 && safeCross > 0) ? 2 : 0;
    const hubAngleOffset = patternShift * rimStep;
    const backSpokes = [];
    const frontSpokes = [];
    const backNipples = [];
    const frontNipples = [];
    const backNippleDots = [];
    const frontNippleDots = [];

    lacingMap(config).forEach((spoke) => {
      const isLeft = spoke.side === 'left';
      const hubRadius = isLeft ? leftHubRadius : rightHubRadius;
      const hubX = isLeft ? leftHubX : rightHubX;
      const hubAngle = (-Math.PI / 2) + (rimStep / 2) + (spoke.hubIndex * hubStep) + hubAngleOffset + (isLeft ? 0 : hubStep / 2);
      const rimAngle = (-Math.PI / 2) + (rimStep / 2) + (spoke.rimIndex * rimStep);
      const hubPoint = { x: hubX, y: cy + (hubRadius * Math.sin(hubAngle)) };
      const rimPoint = { x: rimCenter, y: cy + (innerRadius * Math.sin(rimAngle)) };
      const isFront = (innerRadius * Math.cos(rimAngle)) >= 0;
      const spokeSvg = line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, {
        class: `spoke spoke-${spoke.side} spoke-${spoke.type}`
      });
      (isFront ? frontSpokes : backSpokes).push(spokeSvg);
      if (config.style.nippleStyle === 'nipples') {
        const nipple = spokeNipple(hubPoint, rimPoint);
        const nippleSvg = line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: 'spoke-nipple' });
        (isFront ? frontNipples : backNipples).push(nippleSvg);
      } else if (config.style.nippleStyle === 'dots') {
        const dotSvg = circle(rimPoint.x, rimPoint.y, 1.7, { class: 'spoke-nipple-dot' });
        (isFront ? frontNippleDots : backNippleDots).push(dotSvg);
      }
    });

    return svgDocument(200, 750, '0 0 200 750', [
      tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-back-spokes` }, backSpokes.join('')),
      tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-back-nipples` }, backNipples.join('')),
      hubGroup,
      tag('g', { class: `spoke-theme-${config.style.spokeColor} wheel-front-spokes` }, frontSpokes.join('')),
      tag('g', { class: `nipple-theme-${config.style.nippleColor} wheel-front-nipples` }, frontNipples.join('')),
      rimGroup,
      tag('g', { class: 'wheel-back-nipple-dots' }, backNippleDots.join('')),
      tag('g', { class: 'wheel-front-nipple-dots' }, frontNippleDots.join('')),
    ].join(''), visualizerStyle(config.style), { class: 'wheel-svg' });
  }
}
