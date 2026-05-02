import type { LightingPreset } from '../types/lighting'

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'morning',
    name: 'Morning',
    background: '#9ec3ff',
    ambientIntensity: 0.42,
    directionalColor: '#fff6de',
    directionalIntensity: 1.6,
    directionalPosition: [4, 6, 3],
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    background: '#7a4d31',
    ambientIntensity: 0.28,
    directionalColor: '#ffbe5f',
    directionalIntensity: 2.2,
    directionalPosition: [-5, 5, 2],
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Neon',
    background: '#0a0815',
    ambientIntensity: 0.12,
    directionalColor: '#7dc7ff',
    directionalIntensity: 0.9,
    directionalPosition: [0, 4, 5],
    pointLights: [
      { color: '#ff2fd0', intensity: 14, position: [3, 2, 1], distance: 13 },
      { color: '#13ffd0', intensity: 12, position: [-3, 2, -1], distance: 12 },
      { color: '#6d66ff', intensity: 8, position: [0, 3, -3], distance: 10 },
    ],
  },
  {
    id: 'studio-softbox',
    name: 'Studio Softbox',
    background: '#1a1d24',
    ambientIntensity: 0.6,
    directionalColor: '#ffffff',
    directionalIntensity: 1.35,
    directionalPosition: [2.5, 4, 3.5],
    pointLights: [
      { color: '#dbe8ff', intensity: 2.8, position: [-3, 3, 2], distance: 18 },
    ],
  },
  {
    id: 'night-room',
    name: 'Night Room',
    background: '#07090f',
    ambientIntensity: 0.18,
    directionalColor: '#9bb3ff',
    directionalIntensity: 0.8,
    directionalPosition: [2, 3, -4],
    pointLights: [
      { color: '#ffc56e', intensity: 4.5, position: [-2, 1.6, 2], distance: 9 },
    ],
  },
]

export const DEFAULT_PRESET_ID = 'studio-softbox'

