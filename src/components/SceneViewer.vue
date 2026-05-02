<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { DEFAULT_PRESET_ID, LIGHTING_PRESETS } from '../constants/lightingPresets'
import { useLightingPresets } from '../composables/useLightingPresets'
import { useModelLoader } from '../composables/useModelLoader'
import { useThreeScene } from '../composables/useThreeScene'
import type { LightingSettings } from '../types/lighting'

const props = defineProps<{
  settings: LightingSettings
  modelUrl: string
  modelLabel: string
}>()

const emit = defineEmits<{
  (event: 'model-error', value: string | null): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const three = useThreeScene()
const modelLoader = useModelLoader()
const lighting = useLightingPresets(three.scene)

let modelRoot: THREE.Object3D | null = null
let floor: THREE.Mesh | null = null
let grid: THREE.GridHelper | null = null
let axes: THREE.AxesHelper | null = null
let rafId = 0

const activePreset = computed(() => {
  return (
    LIGHTING_PRESETS.find((preset) => preset.id === props.settings.presetId) ??
    LIGHTING_PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID) ??
    LIGHTING_PRESETS[0]
  )
})

const fitCameraToObject = (object: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 0.001)
  const fitHeightDistance = maxDim / (2 * Math.tan((three.camera.fov * Math.PI) / 360))
  const fitWidthDistance = fitHeightDistance / three.camera.aspect
  const distance = Math.max(1.4 * Math.max(fitHeightDistance, fitWidthDistance), 0.5)
  const center = box.getCenter(new THREE.Vector3())

  three.controls.target.copy(center)
  three.camera.position.set(center.x + distance * 0.8, center.y + distance * 0.6, center.z + distance * 1.1)
  three.camera.near = Math.max(distance / 120, 0.01)
  three.camera.far = distance * 400
  three.camera.updateProjectionMatrix()
  three.controls.minDistance = distance * 0.08
  three.controls.maxDistance = distance * 15
  three.controls.update()
}

const resetCamera = () => {
  if (modelRoot) fitCameraToObject(modelRoot)
}
defineExpose({ resetCamera })

const applyCurrentLighting = () => {
  lighting.applyPreset(activePreset.value, {
    ambientIntensity: props.settings.ambientIntensity,
    directionalIntensity: props.settings.directionalIntensity,
    shadowsEnabled: props.settings.shadowsEnabled,
  })
  three.renderer.shadowMap.enabled = props.settings.shadowsEnabled
}

const applyFloorColor = () => {
  if (!floor) return
  if (floor.material instanceof THREE.MeshStandardMaterial) {
    floor.material.color.set(props.settings.floorColor)
  }
}

const applyHelpersVisibility = () => {
  if (floor) floor.visible = props.settings.floorVisible
  if (grid) grid.visible = props.settings.gridVisible
}

const ensureFloor = () => {
  if (floor) return
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshStandardMaterial({ color: props.settings.floorColor, roughness: 0.95, metalness: 0.05 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -5
  floor.receiveShadow = true
  three.scene.add(floor)

  grid = new THREE.GridHelper(24, 24, '#314164', '#25314f')
  ;(grid.material as THREE.Material).opacity = 0.35
  ;(grid.material as THREE.Material).transparent = true
  three.scene.add(grid)

  axes = new THREE.AxesHelper(1.5)
  axes.position.set(0, 0.01, 0)
  three.scene.add(axes)

  applyHelpersVisibility()
}

const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
  if (Array.isArray(material)) material.forEach((mat) => mat.dispose())
  else material.dispose()
}

const disposeObject3D = (object: THREE.Object3D) => {
  object.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      disposeMaterial(child.material)
    }
  })
}

const loadModel = async () => {
  try {
    emit('model-error', null)
    const loaded = await modelLoader.loadModel(props.modelUrl)

    if (modelRoot) {
      three.scene.remove(modelRoot)
      disposeObject3D(modelRoot)
    }

    modelRoot = loaded.root
    three.scene.add(modelRoot)
    fitCameraToObject(modelRoot)
  } catch {
    emit('model-error', `No se pudo cargar ${props.modelLabel}. Verifica que sea un GLB válido.`)
  }
}

const animate = () => {
  rafId = requestAnimationFrame(animate)
  three.render()
}

const resizeFromContainer = () => {
  const container = containerRef.value
  if (!container) return
  three.setSize(container.clientWidth, container.clientHeight)
}

onMounted(async () => {
  if (!containerRef.value) return
  three.mountTo(containerRef.value)
  ensureFloor()
  applyFloorColor()
  applyHelpersVisibility()
  resizeFromContainer()
  applyCurrentLighting()
  await loadModel()
  animate()
  window.addEventListener('resize', resizeFromContainer)
  await nextTick()
  resizeFromContainer()
})

watch(
  () => props.settings,
  () => {
    applyCurrentLighting()
    applyFloorColor()
    applyHelpersVisibility()
  },
  { deep: true },
)

watch(
  () => props.modelUrl,
  async () => {
    await loadModel()
  },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resizeFromContainer)

  if (modelRoot) {
    three.scene.remove(modelRoot)
    disposeObject3D(modelRoot)
  }
  if (floor) {
    three.scene.remove(floor)
    floor.geometry.dispose()
    disposeMaterial(floor.material)
  }
  if (grid) {
    three.scene.remove(grid)
    grid.geometry.dispose()
    disposeMaterial(grid.material)
  }
  if (axes) {
    three.scene.remove(axes)
    axes.geometry.dispose()
    disposeMaterial(axes.material)
  }

  lighting.dispose()
  three.dispose()
})
</script>

<template>
  <section ref="containerRef" class="scene-container" />
</template>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
  min-height: 350px;
}
</style>

