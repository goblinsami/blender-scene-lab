export type Vec3Tuple = [number, number, number]

export interface PointLightPreset {
  color: string
  intensity: number
  position: Vec3Tuple
  distance?: number
}

export interface LightingPreset {
  id: string
  name: string
  background: string
  ambientIntensity: number
  directionalColor: string
  directionalIntensity: number
  directionalPosition: Vec3Tuple
  pointLights?: PointLightPreset[]
}

export interface LightingSettings {
  presetId: string
  ambientIntensity: number
  directionalIntensity: number
  shadowsEnabled: boolean
  floorColor: string
  floorVisible: boolean
  gridVisible: boolean
}

