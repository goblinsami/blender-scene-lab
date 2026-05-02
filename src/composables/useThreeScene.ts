import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface ThreeSceneContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  mountTo: (container: HTMLElement) => void
  setSize: (width: number, height: number) => void
  render: () => void
  dispose: () => void
}

export function useThreeScene(): ThreeSceneContext {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
  camera.position.set(2, 2, 4)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 0.3
  controls.maxDistance = 40

  let mountedContainer: HTMLElement | null = null

  const mountTo = (container: HTMLElement) => {
    mountedContainer = container
    container.appendChild(renderer.domElement)
  }

  const setSize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  const render = () => {
    controls.update()
    renderer.render(scene, camera)
  }

  const dispose = () => {
    controls.dispose()
    renderer.dispose()
    if (mountedContainer?.contains(renderer.domElement)) {
      mountedContainer.removeChild(renderer.domElement)
    }
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    mountTo,
    setSize,
    render,
    dispose,
  }
}

