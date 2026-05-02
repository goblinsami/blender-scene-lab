import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export interface LoadedModelInfo {
  root: THREE.Object3D
  center: THREE.Vector3
  size: THREE.Vector3
  radius: number
}

export function useModelLoader() {
  const loader = new GLTFLoader()

  const loadModel = async (url: string): Promise<LoadedModelInfo> => {
    const gltf = await loader.loadAsync(url)
    const root = gltf.scene

    root.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(root)
    const center = box.getCenter(new THREE.Vector3())

    root.position.sub(center)

    const centeredBox = new THREE.Box3().setFromObject(root)
    const centeredCenter = centeredBox.getCenter(new THREE.Vector3())
    const centeredSize = centeredBox.getSize(new THREE.Vector3())
    const radius = centeredSize.length() * 0.5

    return {
      root,
      center: centeredCenter,
      size: centeredSize,
      radius,
    }
  }

  return { loadModel }
}

