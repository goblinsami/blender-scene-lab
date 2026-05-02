# blender-scene-lab

Visor 3D experimental con Vue 3 + Vite + TypeScript + Three.js para probar modelos GLB exportados desde Blender.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build de produccion

```bash
npm run build
```

## Exportar modelo .glb desde Blender

1. Abre tu escena en Blender.
2. Selecciona el objeto o coleccion a exportar.
3. Ve a `File > Export > glTF 2.0`.
4. Formato: `glTF Binary (.glb)`.
5. Marca `Selected Objects` si solo quieres exportar lo seleccionado.
6. Ajusta transformaciones si hace falta (aplicar escala/rotacion previamente ayuda).
7. Exporta el archivo.

## Donde colocar modelos

Coloca los modelos en:

- `public/models/`

El primer modelo esperado por la app es:

- `public/models/cup.glb`

Si no existe, el visor mostrara un mensaje de error en pantalla.

## Presets de iluminacion

Los presets estan en:

- `src/constants/lightingPresets.ts`

Cada preset soporta:

- `background`
- `ambientIntensity`
- `directionalColor`
- `directionalIntensity`
- `directionalPosition`
- `pointLights` (opcional, util para estilo neon)

Para anadir uno nuevo:

1. Agrega una nueva entrada al array `LIGHTING_PRESETS`.
2. Define un `id` unico y un `name`.
3. Ajusta intensidades, colores y posiciones.
4. El panel lateral lo mostrara automaticamente.

## Estructura principal

- `src/components/SceneViewer.vue`: canvas, escena, camara, controles, carga GLB y limpieza.
- `src/components/LightingPanel.vue`: UI para presets y controles de luz.
- `src/composables/useThreeScene.ts`: inicializacion y ciclo de renderer/camara/controls.
- `src/composables/useModelLoader.ts`: carga y centrado de GLB.
- `src/composables/useLightingPresets.ts`: aplicacion de presets de iluminacion.
- `src/constants/lightingPresets.ts`: definicion de presets.

