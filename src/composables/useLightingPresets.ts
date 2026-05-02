import * as THREE from 'three'
import type { LightingPreset } from '../types/lighting'

export interface LightingRig {
  ambient: THREE.AmbientLight
  directional: THREE.DirectionalLight
  points: THREE.PointLight[]
}

export function useLightingPresets(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight('#ffffff', 0.5)
  const directional = new THREE.DirectionalLight('#ffffff', 1)
  directional.position.set(3, 4, 2)
  directional.castShadow = true
  directional.shadow.mapSize.set(2048, 2048)
  directional.shadow.camera.near = 0.5
  directional.shadow.camera.far = 80

  scene.add(ambient)
  scene.add(directional)

  let points: THREE.PointLight[] = []

  const clearPoints = () => {
    points.forEach((light) => scene.remove(light))
    points = []
  }

  const applyPreset = (
    preset: LightingPreset,
    options?: { ambientIntensity?: number; directionalIntensity?: number; shadowsEnabled?: boolean },
  ) => {
    scene.background = new THREE.Color(preset.background)

    ambient.intensity = options?.ambientIntensity ?? preset.ambientIntensity

    directional.color.set(preset.directionalColor)
    directional.intensity = options?.directionalIntensity ?? preset.directionalIntensity
    directional.position.set(...preset.directionalPosition)
    directional.castShadow = options?.shadowsEnabled ?? true

    clearPoints()
    if (preset.pointLights?.length) {
      points = preset.pointLights.map((lightDef) => {
        const light = new THREE.PointLight(lightDef.color, lightDef.intensity, lightDef.distance)
        light.position.set(...lightDef.position)
        light.castShadow = options?.shadowsEnabled ?? true
        scene.add(light)
        return light
      })
    }
  }

  const setShadowState = (enabled: boolean) => {
    directional.castShadow = enabled
    points.forEach((light) => {
      light.castShadow = enabled
    })
  }

  const dispose = () => {
    clearPoints()
    scene.remove(ambient)
    scene.remove(directional)
  }

  return {
    rig: {
      ambient,
      directional,
      points,
    },
    applyPreset,
    setShadowState,
    dispose,
  }
}

