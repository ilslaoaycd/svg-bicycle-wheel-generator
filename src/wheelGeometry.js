import { hubHolePositions, lacingMap, normalizeOptions, rimHolePositions } from './math.js';

export function createFaceGeometry(options = {}) {
  const config = normalizeOptions(options);
  const center = 325;
  const outerRadius = 290;
  const erdRadius = 270;
  const rimInnerRadius = Math.max(180, erdRadius - (config.wheel.rimDepth * 1.6));
  const rimOffsetPixels = config.wheel.rimOffset * 3;
  const radiusScale = erdRadius / (config.wheel.erd / 2);
  const holes = rimHolePositions(config, { centerX: center, centerY: center, radius: erdRadius, offset: rimOffsetPixels });
  const hubHoles = hubHolePositions(config, { centerX: center, centerY: center, radiusScale });
  const lacing = lacingMap(config);

  return { config, center, outerRadius, erdRadius, rimInnerRadius, rimOffsetPixels, radiusScale, holes, hubHoles, lacing };
}
