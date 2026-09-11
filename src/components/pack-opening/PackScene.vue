<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import type { OpeningStage, SealBounds } from './types'

const props = defineProps<{ stage: OpeningStage; cover: string; selected: number; canSelect: boolean; progress: number; reducedMotion: boolean }>()
const emit = defineEmits<{
  ready: []; error: []; choose: [id: number]; shuffled: []; focused: []; opened: []; active: [id: number]; seal: [bounds: SealBounds]
}>()
const host = ref<HTMLDivElement>()
const count = 10, packWidth = 1.46, packHeight = 2.616, seam = packHeight / 4
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let frame = 0, observer: ResizeObserver, disposed = false, loaded = false
let rotation = 0, targetRotation = 0, stageStart = 0, stageReported = false, lastActive = -1
let lastTime = 0, pressed = false, dragged = false, startX = 0, lastX = 0, pointerId = -1
let shuffleFrom = 0, shuffleTo = 0
const packs: THREE.Group[] = [], strips: THREE.Group[] = [], faces: THREE.Mesh[] = []
const reflections: THREE.Mesh[] = [], textures: THREE.Texture[] = []
const peelSurfaces: { geometry: THREE.BufferGeometry; original: Float32Array }[][] = []
const focusPositions: THREE.Vector3[] = [], focusRotations: THREE.Quaternion[] = []
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2()
let glow: THREE.Mesh, particles: THREE.Points
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)
const step = Math.PI * 2 / count
const tornWave = (u: number) => .025 * Math.sin(u * Math.PI * 7) + .014 * Math.sin(u * Math.PI * 19 + .7)

function waveEdge(geometry: THREE.BufferGeometry, edge: 'top' | 'bottom') {
  const positions = geometry.attributes.position as THREE.BufferAttribute
  let edgeY = edge === 'top' ? -Infinity : Infinity
  for (let i = 0; i < positions.count; i++) edgeY = edge === 'top' ? Math.max(edgeY, positions.getY(i)) : Math.min(edgeY, positions.getY(i))
  for (let i = 0; i < positions.count; i++) {
    if (Math.abs(positions.getY(i) - edgeY) < .001) {
      const u = (positions.getX(i) + packWidth / 2) / packWidth
      positions.setY(i, positions.getY(i) + tornWave(u))
    }
  }
  positions.needsUpdate = true
}

function cropTexture(source: THREE.Texture, min: number, max: number) {
  const texture = source.clone()
  texture.offset.y = min; texture.repeat.y = max - min; texture.needsUpdate = true
  textures.push(texture)
  return texture
}
function makePack(texture: THREE.Texture, bodyMap: THREE.Texture, topMap: THREE.Texture, id: number) {
  const group = new THREE.Group()
  group.userData.id = id
  const foil = new THREE.MeshStandardMaterial({ color: 0xc3a15e, metalness: .85, roughness: .3 })
  const bodyHeight = seam + packHeight / 2
  const base = new THREE.Mesh(new THREE.BoxGeometry(packWidth, bodyHeight, .035), foil)
  base.position.y = -packHeight / 2 + bodyHeight / 2
  group.add(base)
  const bodyGeometry = new THREE.PlaneGeometry(packWidth, bodyHeight, 48, 1); waveEdge(bodyGeometry, 'top')
  const body = new THREE.Mesh(bodyGeometry, new THREE.MeshBasicMaterial({ map: bodyMap }))
  body.position.set(0, base.position.y, .024)
  body.userData.id = id
  group.add(body); faces.push(body)
  const backGeometry = new THREE.PlaneGeometry(packWidth, bodyHeight, 48, 1); waveEdge(backGeometry, 'top')
  const back = new THREE.Mesh(backGeometry, new THREE.MeshBasicMaterial({ map: bodyMap }))
  back.rotation.y = Math.PI; back.position.set(0, base.position.y, -.025)
  back.userData.id = id; group.add(back); faces.push(back)
  const strip = new THREE.Group()
  strip.position.set(-packWidth / 2, seam, .001)
  const stripHeight = packHeight / 2 - seam
  const top = new THREE.Mesh(new THREE.BoxGeometry(packWidth, stripHeight, .037, 48, 1, 1), foil)
  top.position.set(packWidth / 2, stripHeight / 2, 0)
  strip.add(top)
  const topFaceGeometry = new THREE.PlaneGeometry(packWidth, stripHeight, 48, 1); waveEdge(topFaceGeometry, 'bottom')
  const topFace = new THREE.Mesh(topFaceGeometry, new THREE.MeshBasicMaterial({ map: topMap, side: THREE.DoubleSide }))
  topFace.position.set(packWidth / 2, stripHeight / 2, .025)
  topFace.userData.id = id
  strip.add(topFace); faces.push(topFace); group.add(strip)
  const topBackGeometry = new THREE.PlaneGeometry(packWidth, stripHeight, 48, 1)
  waveEdge(topBackGeometry, 'bottom')
  topBackGeometry.rotateY(Math.PI)
  const topBack = new THREE.Mesh(topBackGeometry, new THREE.MeshBasicMaterial({ map: topMap, side: THREE.DoubleSide }))
  topBack.position.set(packWidth / 2, stripHeight / 2, -.025)
  topBack.userData.id = id; strip.add(topBack); faces.push(topBack)
  peelSurfaces[id] = [top, topFace, topBack].map(mesh => ({ geometry: mesh.geometry, original: new Float32Array(mesh.geometry.attributes.position.array) }))
  // A low-opacity inverted image creates a subtle stage reflection, without a second renderer.
  const reflection = new THREE.Mesh(new THREE.PlaneGeometry(packWidth, packHeight), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .065, depthWrite: false }))
  reflection.position.set(0, -packHeight - .035, .012); reflection.scale.y = -1
  group.add(reflection); reflections.push(reflection)
  scene.add(group); packs.push(group); strips.push(strip)
}
function placeRing() {
  packs.forEach((pack, i) => {
    const angle = i * step + rotation
    pack.position.set(Math.sin(angle) * 2.8, 0, Math.cos(angle) * 2.8 - 1.5)
    pack.rotation.set(0, angle, 0)
    pack.scale.setScalar(1)
    pack.visible = true
    reflections[i].visible = true
  })
  const active = ((Math.round(-rotation / step) % count) + count) % count
  if (active !== lastActive) { lastActive = active; emit('active', active) }
}
function projectSeal() {
  const pack = packs[props.selected]
  if (!pack || !host.value) return
  pack.updateMatrixWorld(true)
  const left = pack.localToWorld(new THREE.Vector3(-packWidth / 2, seam, .04)).project(camera)
  const right = pack.localToWorld(new THREE.Vector3(packWidth / 2, seam, .04)).project(camera)
  const { width, height } = host.value.getBoundingClientRect()
  emit('seal', { left: (left.x + 1) * width / 2, top: (1 - left.y) * height / 2, width: (right.x - left.x) * width / 2 })
}
function resize() {
  if (!host.value || !renderer) return
  const { width, height } = host.value.getBoundingClientRect()
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.fov = width < 600 ? 44 : 38
  camera.position.z = width < 600 ? 9.7 : 9
  camera.updateProjectionMatrix()
}
function navigate(direction: number) {
  if (!loaded || props.stage !== 'choose') return
  targetRotation += direction * step
}
function pick(event: PointerEvent) {
  if (!props.canSelect || props.stage !== 'choose') return
  const rect = renderer.domElement.getBoundingClientRect()
  pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(faces, false)[0]
  if (hit) emit('choose', hit.object.userData.id)
}
function down(event: PointerEvent) {
  if (props.stage !== 'choose' || !loaded || (event.pointerType === 'mouse' && event.button !== 0)) return
  pressed = true; dragged = false; startX = lastX = event.clientX; pointerId = event.pointerId
  renderer.domElement.setPointerCapture(event.pointerId)
}
function move(event: PointerEvent) {
  if (!pressed || event.pointerId !== pointerId) return
  if (Math.abs(event.clientX - startX) > 7) dragged = true
  targetRotation += (event.clientX - lastX) * .007
  lastX = event.clientX
}
function up(event: PointerEvent) {
  if (!pressed || event.pointerId !== pointerId) return
  pressed = false
  if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId)
  if (dragged) targetRotation = Math.round(targetRotation / step) * step
  else pick(event)
}
function cancel() { pressed = false; targetRotation = Math.round(targetRotation / step) * step }
function wheel(event: WheelEvent) {
  if (props.stage !== 'choose') return
  event.preventDefault()
  targetRotation += Math.max(-100, Math.min(100, event.deltaX || event.deltaY)) * .003
}
watch(() => props.stage, (stage) => {
  stageStart = performance.now(); stageReported = false; pressed = false
  if (stage === 'shuffle') { shuffleFrom = rotation; shuffleTo = Math.round(rotation / step) * step + Math.PI * 4 + Math.floor(Math.random() * count) * step }
  if (stage === 'focus') {
    packs.forEach((pack, i) => { focusPositions[i] = pack.position.clone(); focusRotations[i] = pack.quaternion.clone() })
  }
})
function tick(now: number) {
  if (disposed) return
  frame = requestAnimationFrame(tick)
  const dt = Math.min((now - lastTime) / 1000, .06); lastTime = now
  if (!loaded) return
  const elapsed = now - stageStart
  if (props.stage === 'choose') {
    rotation += (targetRotation - rotation) * (1 - Math.exp(-dt * 10))
    placeRing()
  } else if (props.stage === 'shuffle') {
    const t = Math.min(1, elapsed / (props.reducedMotion ? 350 : 2300))
    rotation = THREE.MathUtils.lerp(shuffleFrom, shuffleTo, t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    placeRing()
    if (t === 1 && !stageReported) { stageReported = true; targetRotation = rotation; emit('shuffled') }
  } else if (props.stage === 'focus') {
    const t = ease(elapsed / (props.reducedMotion ? 120 : 950))
    packs.forEach((pack, i) => {
      reflections[i].visible = false
      if (i === props.selected) {
        pack.position.lerpVectors(focusPositions[i], new THREE.Vector3(0, -.08, 3.9), t)
        pack.quaternion.slerpQuaternions(focusRotations[i], new THREE.Quaternion(), t)
      } else { pack.scale.setScalar(1 - t); pack.position.y = focusPositions[i].y - t * 1.5 }
    })
    if (t === 1 && !stageReported) { stageReported = true; emit('focused') }
  } else if (props.stage === 'tear' || props.stage === 'opening') {
    const pack = packs[props.selected], strip = strips[props.selected]
    const opening = props.stage === 'opening' ? ease(elapsed / (props.reducedMotion ? 150 : 1150)) : 0
    // Release vertices behind the cut from left to right; the uncut right side stays attached.
    peelSurfaces[props.selected].forEach(({ geometry, original }) => {
      const positions = geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < positions.count; i++) {
        const x = original[i * 3], u = (x + packWidth / 2) / packWidth
        const released = Math.max(0, props.progress - u)
        const curl = released * released
        positions.setXYZ(i, x + curl * .12, original[i * 3 + 1] + curl * .5, original[i * 3 + 2] + curl * .3)
      }
      positions.needsUpdate = true
      geometry.computeVertexNormals()
    })
    strip.rotation.z = 0
    strip.position.x = -packWidth / 2 + opening * 1.8
    strip.position.y = seam + opening * 1.7
    strip.position.z = opening * .7
    pack.position.y = -.08 - opening * .22
    glow.visible = opening > 0
    ;(glow.material as THREE.MeshBasicMaterial).opacity = Math.sin(opening * Math.PI) * .65
    glow.scale.setScalar(1 + opening * 4)
    particles.visible = opening > .05 && !props.reducedMotion
    particles.rotation.z = opening * .2; particles.scale.setScalar(1 + opening * 2)
    if (opening === 1 && !stageReported) { stageReported = true; emit('opened') }
    if (props.stage === 'tear') projectSeal()
  }
  renderer.render(scene, camera)
}
function contextLost(event: Event) { event.preventDefault(); emit('error') }
onMounted(() => {
  try {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(38, 1, .1, 60)
    camera.position.set(0, .05, 9); camera.lookAt(0, -.05, 0)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.value!.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-label', '可左右拖动的立体卡包轮盘')
    scene.add(new THREE.AmbientLight(0xffefd3, 2))
    const light = new THREE.DirectionalLight(0xffe0a0, 4); light.position.set(-3, 5, 7); scene.add(light)
    const rim = new THREE.DirectionalLight(0xffffff, 3); rim.position.set(4, 2, -3); scene.add(rim)
    glow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .04), new THREE.MeshBasicMaterial({ color: 0xffe5a8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.position.set(0, seam - .08, 4); glow.visible = false; scene.add(glow)
    const positions = new Float32Array(90 * 3)
    for (let i = 0; i < 90; i++) { positions[i * 3] = (Math.random() - .5) * 2.5; positions[i * 3 + 1] = Math.random() * 2; positions[i * 3 + 2] = 4 }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xffdd95, size: .016, transparent: true, opacity: .8, depthWrite: false }))
    particles.visible = false; scene.add(particles)
    const canvas = renderer.domElement
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', cancel)
    canvas.addEventListener('wheel', wheel, { passive: false }); canvas.addEventListener('webglcontextlost', contextLost)
    observer = new ResizeObserver(resize); observer.observe(host.value!); resize()
    new THREE.TextureLoader().load(props.cover, (texture) => {
      if (disposed) { texture.dispose(); return }
      texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      textures.push(texture)
      const bodyHeight = seam + packHeight / 2
      const bodyMap = cropTexture(texture, 0, bodyHeight / packHeight)
      const topMap = cropTexture(texture, bodyHeight / packHeight, 1)
      for (let i = 0; i < count; i++) makePack(texture, bodyMap, topMap, i)
      loaded = true; placeRing(); emit('ready')
    }, undefined, () => { if (!disposed) emit('error') })
    frame = requestAnimationFrame(tick)
  } catch { emit('error') }
})
onBeforeUnmount(() => {
  disposed = true; cancelAnimationFrame(frame); observer?.disconnect()
  if (renderer) {
    const canvas = renderer.domElement
    canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
    canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', cancel)
    canvas.removeEventListener('wheel', wheel); canvas.removeEventListener('webglcontextlost', contextLost)
  }
  const materials = new Set<THREE.Material>(), geometries = new Set<THREE.BufferGeometry>()
  scene?.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Points) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)) } })
  geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose())
  renderer?.dispose(); renderer?.domElement.remove()
})
defineExpose({ navigate })
</script>

<template><div ref="host" class="pack-canvas" /></template>
<style scoped>.pack-canvas{position:absolute;inset:0;touch-action:none}.pack-canvas :deep(canvas){display:block;width:100%;height:100%;cursor:grab}.pack-canvas :deep(canvas:active){cursor:grabbing}</style>
