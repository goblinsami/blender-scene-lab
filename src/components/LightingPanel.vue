<script setup lang="ts">
import { computed } from 'vue'
import { LIGHTING_PRESETS } from '../constants/lightingPresets'
import type { LightingSettings } from '../types/lighting'

interface ModelOption {
  id: string
  label: string
}

const props = defineProps<{
  settings: LightingSettings
  selectedModel: string
  modelOptions: ModelOption[]
}>()

const emit = defineEmits<{
  (event: 'update:preset-id', value: string): void
  (event: 'update:ambient-intensity', value: number): void
  (event: 'update:directional-intensity', value: number): void
  (event: 'update:shadows-enabled', value: boolean): void
  (event: 'update:floor-color', value: string): void
  (event: 'update:floor-visible', value: boolean): void
  (event: 'update:grid-visible', value: boolean): void
  (event: 'update:selected-model', value: string): void
  (event: 'import-glb', value: FileList): void
  (event: 'reset-camera'): void
}>()

const selectedPreset = computed(() => props.settings.presetId)

const onImport = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  emit('import-glb', input.files)
  input.value = ''
}
</script>

<template>
  <aside class="panel">
    <h2>Lighting Lab</h2>

    <section class="group">
      <label for="modelSelect" class="group-title">Model</label>
      <select
        id="modelSelect"
        class="model-select"
        :value="selectedModel"
        @change="emit('update:selected-model', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="model in modelOptions" :key="model.id" :value="model.id">{{ model.label }}</option>
      </select>
      <input type="file" accept=".glb" multiple @change="onImport" />
    </section>

    <section class="group">
      <label for="floorColor" class="group-title">Floor Color</label>
      <input
        id="floorColor"
        type="color"
        class="color-input"
        :value="settings.floorColor"
        @input="emit('update:floor-color', ($event.target as HTMLInputElement).value)"
      />
    </section>

    <section class="group">
      <label class="group-title">Presets</label>
      <div class="preset-grid">
        <button
          v-for="preset in LIGHTING_PRESETS"
          :key="preset.id"
          class="preset-button"
          :class="{ active: preset.id === selectedPreset }"
          @click="emit('update:preset-id', preset.id)"
        >
          {{ preset.name }}
        </button>
      </div>
    </section>

    <section class="group">
      <label for="ambientRange" class="group-title">Ambient Intensity</label>
      <input
        id="ambientRange"
        type="range"
        min="0"
        max="2"
        step="0.01"
        :value="settings.ambientIntensity"
        @input="emit('update:ambient-intensity', Number(($event.target as HTMLInputElement).value))"
      />
      <span class="value">{{ settings.ambientIntensity.toFixed(2) }}</span>
    </section>

    <section class="group">
      <label for="directionalRange" class="group-title">Directional Intensity</label>
      <input
        id="directionalRange"
        type="range"
        min="0"
        max="4"
        step="0.01"
        :value="settings.directionalIntensity"
        @input="emit('update:directional-intensity', Number(($event.target as HTMLInputElement).value))"
      />
      <span class="value">{{ settings.directionalIntensity.toFixed(2) }}</span>
    </section>

    <section class="group inline">
      <label for="floorToggle" class="group-title">Ocultar Suelo</label>
      <input
        id="floorToggle"
        type="checkbox"
        :checked="!settings.floorVisible"
        @change="emit('update:floor-visible', !($event.target as HTMLInputElement).checked)"
      />
    </section>

    <section class="group inline">
      <label for="gridToggle" class="group-title">Ocultar Grid</label>
      <input
        id="gridToggle"
        type="checkbox"
        :checked="!settings.gridVisible"
        @change="emit('update:grid-visible', !($event.target as HTMLInputElement).checked)"
      />
    </section>

    <section class="group inline">
      <label for="shadowsToggle" class="group-title">Shadows</label>
      <input
        id="shadowsToggle"
        type="checkbox"
        :checked="settings.shadowsEnabled"
        @change="emit('update:shadows-enabled', ($event.target as HTMLInputElement).checked)"
      />
    </section>

    <button class="reset-btn" @click="emit('reset-camera')">Reset Camera</button>
  </aside>
</template>

<style scoped>
.panel { width: 320px; min-width: 280px; background: linear-gradient(160deg, #151925 0%, #0e1118 100%); border-left: 1px solid #252b3d; color: #e5e9f3; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; box-sizing: border-box; }
h2 { margin: 0; font-size: 1.1rem; letter-spacing: 0.03em; }
.group { display: flex; flex-direction: column; gap: 0.45rem; }
.group.inline { flex-direction: row; align-items: center; justify-content: space-between; }
.group-title { color: #a8b1c7; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; }
.preset-grid { display: grid; grid-template-columns: 1fr; gap: 0.45rem; }
.preset-button, .reset-btn { border: 1px solid #2d3448; background: #1a2030; color: #dfe5f5; padding: 0.55rem 0.7rem; border-radius: 0.6rem; cursor: pointer; transition: all 180ms ease; text-align: left; }
.preset-button:hover, .reset-btn:hover { background: #242b3f; border-color: #3d4870; }
.preset-button.active { background: #2f3d66; border-color: #647fcb; }
.model-select, .color-input { border: 1px solid #2d3448; background: #1a2030; color: #dfe5f5; padding: 0.55rem 0.7rem; border-radius: 0.6rem; }
.color-input { width: 100%; height: 2.2rem; padding: 0.2rem; }
.value { font-size: 0.78rem; color: #9aa6c4; }
input[type='range'] { accent-color: #88a4ff; }
@media (max-width: 960px) { .panel { width: 100%; min-width: auto; border-left: none; border-top: 1px solid #252b3d; } .preset-grid { grid-template-columns: 1fr 1fr; } }
</style>

