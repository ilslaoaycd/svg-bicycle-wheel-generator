import { createVisualizerStyle } from './styles.js';

export function fmt(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : String(value);
}

function roundNumbers(value) {
  return String(value).replace(/-?(?:\d+\.\d+|\d+\.|\.\d+)(?:e[+-]?\d+)?|-?\d+e[+-]?\d+/gi, (match) => fmt(Number(match)));
}

export function formatPathData(d) {
  return roundNumbers(d);
}

function formatAttribute(key, value) {
  if (typeof value === 'number') return fmt(value);
  if (key === 'd' || key === 'viewBox' || key === 'points' || key === 'transform' || key === 'stroke-dasharray') return roundNumbers(value);
  return value;
}

export function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function attrs(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? key : `${key}="${escapeText(formatAttribute(key, value))}"`)
    .join(' ');
}

export function tag(name, attributes = {}, content = '') {
  const attributeText = attrs(attributes);
  const open = attributeText ? `<${name} ${attributeText}` : `<${name}`;
  return content === null ? `${open}/>` : `${open}>${content}</${name}>`;
}

export function line(x1, y1, x2, y2, attributes = {}) {
  return tag('line', { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), ...attributes }, null);
}

export function circle(cx, cy, r, attributes = {}) {
  return tag('circle', { cx: fmt(cx), cy: fmt(cy), r: fmt(r), ...attributes }, null);
}

export function rect(x, y, width, height, attributes = {}) {
  return tag('rect', { x: fmt(x), y: fmt(y), width: fmt(width), height: fmt(height), ...attributes }, null);
}

export function path(d, attributes = {}) {
  return tag('path', { d: formatPathData(d), ...attributes }, null);
}

export function text(x, y, content, attributes = {}) {
  return tag('text', { x: fmt(x), y: fmt(y), ...attributes }, escapeText(content));
}

export function svgDocument(width, height, viewBox, content, style = '', attributes = {}) {
  return tag('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox,
    preserveAspectRatio: 'xMidYMid meet',
    ...attributes
  }, `${style ? tag('style', {}, style) : ''}${content}`);
}

export function visualizerStyle(style = {}) {
  return createVisualizerStyle(style);
}
