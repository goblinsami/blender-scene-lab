<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import LightingPanel from './components/LightingPanel.vue'
import SceneViewer from './components/SceneViewer.vue'
import { DEFAULT_PRESET_ID, LIGHTING_PRESETS } from './constants/lightingPresets'
import type { LightingSettings } from './types/lighting'

interface SceneViewerExpose {
  resetCamera: () => void
}

interface ModelOption {
  id: string
  label: string
  url: string
  source: 'public' | 'upload'
}

const STORAGE_KEY = 'blender-scene-lab-uploaded-models'

const defaultPreset = LIGHTING_PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID) ?? LIGHTING_PRESETS[0]

const settings = reactive<LightingSettings>({
  presetId: defaultPreset.id,
  ambientIntensity: defaultPreset.ambientIntensity,
  directionalIntensity: defaultPreset.directionalIntensity,
  shadowsEnabled: true,
  floorColor: '#1e2433',
  floorVisible: true,
  gridVisible: true,
})

const modelOptions = ref<ModelOption[]>([
  { id: 'public:cup.glb', label: 'cup.glb', url: '/models/cup.glb', source: 'public' },
  { id: 'public:gun.glb', label: 'gun.glb', url: '/models/gun.glb', source: 'public' },
  { id: 'public:monkey2.glb', label: 'monkey2.glb', url: '/models/monkey2.glb', source: 'public' },

])
const selectedModelId = ref(modelOptions.value[1]?.id ?? modelOptions.value[0].id)

const modelError = ref<string | null>(null)
const sceneViewerRef = ref<SceneViewerExpose | null>(null)

const selectedModel = computed(() => {
  return modelOptions.value.find((item) => item.id === selectedModelId.value) ?? modelOptions.value[0]
})

const uploadLabels = computed(() => modelOptions.value.filter((item) => item.source === 'upload').map((item) => item.label))

const clearTransientStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const saveUploadsToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadLabels.value))
}

const importGlbFiles = (fileList: FileList) => {
  const files = Array.from(fileList).filter((file) => file.name.toLowerCase().endsWith('.glb'))
  if (!files.length) return

  for (const file of files) {
    const id = `upload:${file.name}:${file.lastModified}`
    const existing = modelOptions.value.find((item) => item.id === id)
    if (existing) continue

    const url = URL.createObjectURL(file)
    modelOptions.value.push({ id, label: file.name, url, source: 'upload' })
    selectedModelId.value = id
  }

  saveUploadsToStorage()
}

const revokeUploadedUrls = () => {
  for (const item of modelOptions.value) {
    if (item.source === 'upload') {
      URL.revokeObjectURL(item.url)
    }
  }
}

watch(
  () => settings.presetId,
  (presetId) => {
    const preset = LIGHTING_PRESETS.find((item) => item.id === presetId)
    if (!preset) return
    settings.ambientIntensity = preset.ambientIntensity
    settings.directionalIntensity = preset.directionalIntensity
  },
)

const activePresetName = computed(() => {
  return LIGHTING_PRESETS.find((preset) => preset.id === settings.presetId)?.name ?? 'Custom'
})

const resetCamera = () => {
  sceneViewerRef.value?.resetCamera()
}

onMounted(() => {
  clearTransientStorage()
  window.addEventListener('beforeunload', clearTransientStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', clearTransientStorage)
  revokeUploadedUrls()
  clearTransientStorage()
})

const showBar = ref(false)
</script>

<template>
  <main class="app-shell">
    <section class="viewport-area">
      <header class="toolbar">
        <div>
          <h1>Blender Scene Lab</h1>
          <p>Preset activo: {{ activePresetName }}</p>
          <button @click="showBar = !showBar">{{ showBar ? 'Hide' : 'Show' }} bar</button>
        </div>
      </header>

      <SceneViewer
        ref="sceneViewerRef"
        :settings="settings"
        :model-url="selectedModel.url"
        :model-label="selectedModel.label"
        @model-error="modelError = $event"
      />

      <div v-if="modelError" class="error-banner">{{ modelError }}</div>
    </section>

    <LightingPanel
      :settings="settings"
      :selected-model="selectedModelId"
      :model-options="modelOptions"
      @update:preset-id="settings.presetId = $event"
      @update:ambient-intensity="settings.ambientIntensity = $event"
      @update:directional-intensity="settings.directionalIntensity = $event"
      @update:shadows-enabled="settings.shadowsEnabled = $event"
      @update:floor-color="settings.floorColor = $event"
      @update:floor-visible="settings.floorVisible = $event"
      @update:grid-visible="settings.gridVisible = $event"
      @update:selected-model="selectedModelId = $event"
      @import-glb="importGlbFiles"
      @reset-camera="resetCamera"
      v-if="showBar"
    >
    <button @click="showBar = !showBar">{{ showBar ? 'Hide' : 'Show' }} bar</button>
    </LightingPanel>
  </main>
</template>

