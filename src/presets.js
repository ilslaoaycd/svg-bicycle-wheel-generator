export const stylePresets = {
  technical: {
    background: '#ffffff',
    rimFill: '#424c57',
    rimInnerFill: '#ffffff',
    rimStroke: '#202832',
    leftSpoke: '#2563eb',
    rightSpoke: '#f97316',
    mutedSpoke: '#94a3b8',
    hubFill: '#1f2933',
    hubStroke: '#0f1720',
    holeFill: '#ffffff',
    marker: '#c0392b',
    guide: '#d7dee8',
    text: '#344054',
    dimension: '#10b981'
  },
  blueprint: {
    background: '#f7fbff',
    rimFill: '#dbeafe',
    rimInnerFill: '#f7fbff',
    rimStroke: '#1e40af',
    leftSpoke: '#2563eb',
    rightSpoke: '#0f766e',
    mutedSpoke: '#93c5fd',
    hubFill: '#bfdbfe',
    hubStroke: '#1d4ed8',
    holeFill: '#ffffff',
    marker: '#dc2626',
    guide: '#bfdbfe',
    text: '#1e3a8a',
    dimension: '#0891b2'
  },
  productPreview: {
    background: '#ffffff',
    rimFill: '#111827',
    rimInnerFill: '#ffffff',
    rimStroke: '#030712',
    leftSpoke: '#71717a',
    rightSpoke: '#3f3f46',
    mutedSpoke: '#a1a1aa',
    hubFill: '#27272a',
    hubStroke: '#09090b',
    holeFill: '#f8fafc',
    marker: '#ef4444',
    guide: '#e5e7eb',
    text: '#27272a',
    dimension: '#84cc16'
  },
  debug: {
    background: '#ffffff',
    rimFill: '#334155',
    rimInnerFill: '#ffffff',
    rimStroke: '#0f172a',
    leftSpoke: '#2563eb',
    rightSpoke: '#f97316',
    mutedSpoke: '#64748b',
    hubFill: '#111827',
    hubStroke: '#020617',
    holeFill: '#ffffff',
    marker: '#b91c1c',
    guide: '#cbd5e1',
    text: '#0f172a',
    dimension: '#eab308',
    showLabels: true
  }
};

export function resolveStylePreset(style, overrides = {}) {
  const base = typeof style === 'string' ? stylePresets[style] || stylePresets.technical : style || {};
  return { ...base, ...overrides };
}
