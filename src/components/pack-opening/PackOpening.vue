<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PackScene from './PackScene.vue'
import OpeningVideo from './OpeningVideo.vue'
import ResultReveal from './ResultReveal.vue'
import { PACK_COVER, PACK_VIDEO, type OpeningResult, type OpeningStage, type SealBounds } from './types'

const props = withDefaults(defineProps<{ title?: string; count?: number; cover?: string; videoSrc?: string; reducedMotion?: boolean; preview?: boolean; results?: OpeningResult[] }>(), {
  title: 'OK PACK', count: 1, cover: PACK_COVER, videoSrc: PACK_VIDEO, reducedMotion: false, preview: false,
  results: () => [{ name: '皮卡丘 VMAX', rarity: 'RARE', coin: 2000, image: '/images/pokemon/pikachu.png' }],
})
const emit = defineEmits<{ close: []; complete: []; opened: [selection: { packIndex: number; count: number }] }>()
const { t } = useI18n()
const stage = ref<OpeningStage>('choose'), ready = ref(false), failed = ref(false), shuffled = ref(false)
const selected = ref(0), active = ref(0), progress = ref(0), sceneKey = ref(0)
const scene = ref<InstanceType<typeof PackScene>>(), panel = ref<HTMLElement>(), sealButton = ref<HTMLButtonElement>()
const seal = ref<SealBounds>({ left: 0, top: 0, width: 0 }), systemReduced = ref(false)
const motion = computed(() => props.reducedMotion || systemReduced.value)
const displayResults = computed(() => props.results.map(result => ({
  ...result,
  name: result.name === '皮卡丘 VMAX' || result.name === 'Pikachu VMAX' ? t('cards.pikachu.name') : result.name,
})))
const heading = computed(() => t(`opening.headings.${stage.value === 'choose' && shuffled.value ? 'shuffled' : stage.value}`))
const instruction = computed(() => t(`opening.instructions.${stage.value}`))
const stepIndex = computed(() => ['choose', 'shuffle'].includes(stage.value) ? 0 : ['focus', 'tear'].includes(stage.value) ? 1 : 2)
const sealStyle = computed(() => ({ left: `${seal.value.left}px`, top: `${seal.value.top - 24}px`, width: `${seal.value.width}px` }))
let dragging = false, pointerId = -1, start = 0, farthest = 0
let previousOverflow = '', previousFocus: HTMLElement | null = null
let media: MediaQueryList
let preloadVideo: HTMLVideoElement | undefined
function shuffle() { if (!ready.value || stage.value !== 'choose') return; stage.value = 'shuffle' }
function choose(id: number) {
  if (!ready.value || failed.value || stage.value !== 'choose') return
  selected.value = id; stage.value = 'focus'
}
async function focused() { stage.value = 'tear'; await nextTick(); sealButton.value?.focus({ preventScroll: true }) }
function startCut(event: PointerEvent) {
  if (stage.value !== 'tear' || (event.pointerType === 'mouse' && event.button !== 0)) return
  const rect = sealButton.value!.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  // Only a stroke starting at the left edge can open the pack.
  if (x < 0 || x > .15) return
  dragging = true; pointerId = event.pointerId; start = x; farthest = 0; progress.value = 0
  sealButton.value!.setPointerCapture(pointerId)
  event.preventDefault()
}
function moveCut(event: PointerEvent) {
  if (!dragging || event.pointerId !== pointerId || stage.value !== 'tear') return
  const rect = sealButton.value!.getBoundingClientRect()
  if (Math.abs(event.clientY - (rect.top + rect.height / 2)) > 42) { stopCut(); return }
  const x = (event.clientX - rect.left) / rect.width
  farthest = Math.max(farthest, x - start)
  progress.value = Math.min(1, farthest / .82)
  if (progress.value >= 1) { dragging = false; stage.value = 'opening' }
}
function stopCut() {
  if (dragging) { dragging = false; progress.value = 0 }
  if (pointerId !== -1 && sealButton.value?.hasPointerCapture(pointerId)) sealButton.value.releasePointerCapture(pointerId)
  pointerId = -1
}
function keyboardCut(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    event.preventDefault(); progress.value = Math.min(1, progress.value + .1)
    if (progress.value > .99) { progress.value = 1; stage.value = 'opening' }
  }
}
function opened() {
  emit('opened', { packIndex: selected.value, count: props.count })
  stage.value = props.videoSrc ? 'video' : 'handoff'
}
function resultAgain() { if (props.preview) reset(); else emit('complete') }
function reset() {
  stage.value = 'choose'; shuffled.value = ready.value = failed.value = false
  progress.value = 0; selected.value = active.value = 0; sceneKey.value++
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.preventDefault(); emit('close'); return }
  if (stage.value === 'choose' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault(); scene.value?.navigate(event.key === 'ArrowLeft' ? 1 : -1)
  }
  if (event.key === 'Tab') {
    const items = Array.from(panel.value!.querySelectorAll<HTMLElement>('button:not(:disabled),video[controls],[tabindex="0"]')).filter(el => el.getClientRects().length)
    const first = items[0], last = items[items.length - 1]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
}
function mediaChange() { systemReduced.value = media.matches }
onMounted(() => {
  previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'
  previousFocus = document.activeElement as HTMLElement; panel.value?.focus()
  media = matchMedia('(prefers-reduced-motion: reduce)'); mediaChange(); media.addEventListener('change', mediaChange)
  if (props.videoSrc) {
    preloadVideo = document.createElement('video')
    preloadVideo.preload = 'auto'
    preloadVideo.playsInline = true
    preloadVideo.src = props.videoSrc
    preloadVideo.load()
  }
})
onBeforeUnmount(() => { document.body.style.overflow = previousOverflow; media?.removeEventListener('change', mediaChange); if (preloadVideo) { preloadVideo.removeAttribute('src'); preloadVideo.load() }; previousFocus?.focus() })
</script>

<template>
  <Teleport to="body">
    <section ref="panel" class="pack-experience" role="dialog" aria-modal="true" aria-labelledby="pack-heading" tabindex="-1" :data-stage="stage" @keydown="keydown">
      <header class="experience-header">
        <div class="opening-brand">OK<span> / </span>PACK <small>{{ t('eyebrow.collectorMoment') }}</small></div>
        <div class="edition">{{ title }}<span>{{ preview ? t('opening.experience') : t('opening.draws',{count}) }}</span></div>
        <button class="close-opening" :aria-label="t('opening.close')" @click="emit('close')">×</button>
      </header>
      <div class="experience-intro" aria-live="polite">
        <span class="chapter">{{ String(stepIndex + 1).padStart(2, '0') }} / THE OPENING RITUAL</span>
        <h1 id="pack-heading">{{ heading }}</h1><p>{{ instruction }}</p>
      </div>
      <div v-if="!['video','handoff'].includes(stage)" class="scene-area">
        <div class="stage-halo"/><div class="stage-floor"/>
        <PackScene v-if="!failed" :key="sceneKey" ref="scene" :stage="stage" :cover="cover" :selected="selected" :can-select="ready" :progress="progress" :reduced-motion="motion"
          @ready="ready=true" @error="failed=true" @active="active=$event" @choose="choose" @seal="seal=$event" @shuffled="shuffled=true;stage='choose'" @focused="focused" @opened="opened"/>
        <div v-if="!ready && !failed" class="scene-status"><i class="loading-ring"/>{{ t('opening.preparing') }}</div>
        <div v-if="failed" class="scene-status"><p>{{ t('opening.threeError') }}</p><button class="gold-button" @click="reset">{{ t('opening.reload') }}</button><button class="text-button" @click="emit('close')">{{ t('opening.back') }}</button></div>
        <button v-if="stage==='tear' && seal.width" ref="sealButton" class="tear-seal" :class="{cutting:progress>0,'reduce-motion':motion}" :style="sealStyle" :aria-label="t('opening.tearAria')" @pointerdown="startCut" @pointermove="moveCut" @pointerup="stopCut" @pointercancel="stopCut" @keydown="keyboardCut">
          <svg class="seal-line" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><path d="M0 7 C4 2 8 12 13 6 S22 3 27 8 S36 11 41 5 S50 1 55 7 S64 13 69 6 S78 2 83 8 S92 11 100 5"/></svg>
          <span class="seal-progress" :style="{width:`${progress*100}%`}"><svg viewBox="0 0 100 14" preserveAspectRatio="none"><path d="M0 7 C4 2 8 12 13 6 S22 3 27 8 S36 11 41 5 S50 1 55 7 S64 13 69 6 S78 2 83 8 S92 11 100 5"/></svg></span>
        </button>
        <div v-if="stage==='choose' && ready" class="pack-index">PACK <b>{{ String(active+1).padStart(2,'0') }}</b><span>/ 10</span></div>
      </div>
      <OpeningVideo v-else-if="stage==='video'" :src="videoSrc" @complete="stage='handoff'"/>
      <ResultReveal v-else :results="displayResults" :preview="preview" @again="resultAgain" @close="emit('close')"/>
      <footer class="experience-footer">
        <div v-if="['choose','shuffle'].includes(stage)" class="wheel-controls">
          <button class="round-button" :aria-label="t('opening.left')" :disabled="!ready || stage==='shuffle' || failed" @click="scene?.navigate(1)">‹</button>
          <button class="gold-button shuffle-button" :disabled="!ready || stage==='shuffle' || failed" @click="shuffle"><span class="shuffle-symbol">⤨</span>{{ stage==='shuffle'?t('opening.shuffling'):shuffled?t('opening.shuffleAgain'):t('opening.shuffle') }}</button>
          <button class="round-button" :aria-label="t('opening.right')" :disabled="!ready || stage==='shuffle' || failed" @click="scene?.navigate(-1)">›</button>
        </div>
        <button v-if="['choose','shuffle'].includes(stage)" class="text-button choose-current" :disabled="!ready || failed || stage==='shuffle'" @click="choose(active)">{{ t('opening.choose') }}</button>
        <p v-else-if="stage==='tear'" class="gesture-hint">{{ t('opening.gesture') }}</p>
      </footer>
    </section>
  </Teleport>
</template>

<style scoped>
.pack-experience{position:fixed;inset:0;z-index:1000;overflow:hidden;display:flex;flex-direction:column;background:#080909;color:#f6f1e6;font-family:inherit;outline:none;background-image:radial-gradient(ellipse at 50% 50%,#25201655,transparent 55%)}
.experience-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 40px;z-index:2}.opening-brand{font-size:22px;letter-spacing:3px;font-weight:800}.opening-brand>span{color:#bd9756}.opening-brand small{display:block;font-size:8px;letter-spacing:2.1px;font-weight:400;color:#887d69;margin-top:6px}.edition{margin-left:auto;text-align:right;font-size:12px;color:#e1d1b0}.edition span{display:block;color:#7d786f;font-size:10px;margin-top:5px}.close-opening{border:1px solid #ffffff20;background:#ffffff05;border-radius:50%;width:38px;height:38px;color:#bfb7a7;font-size:24px;cursor:pointer}
.experience-intro{text-align:center;position:relative;z-index:2;pointer-events:none;padding:8px 16px 0}.chapter{font-size:9px;color:#bb975e;letter-spacing:3px}.experience-intro h1{font-size:clamp(22px,2.2vw,34px);font-weight:500;letter-spacing:5px;margin:14px 0 10px}.experience-intro p{font-size:12px;color:#99958c;margin:0;letter-spacing:1px}
.scene-area{position:relative;flex:1;min-height:180px}.stage-halo{position:absolute;width:min(65vw,700px);height:65%;left:50%;top:20%;transform:translateX(-50%);background:radial-gradient(ellipse,#b7985120,transparent 70%);pointer-events:none}.stage-floor{position:absolute;left:50%;bottom:7%;width:55%;height:15%;transform:translateX(-50%);border-radius:50%;border:1px solid #b38c4420;box-shadow:0 0 70px #b38c4408;background:radial-gradient(ellipse,#b38c4410,transparent 70%);pointer-events:none}.pack-index{position:absolute;bottom:2%;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:2px;color:#827563;pointer-events:none}.pack-index b{color:#e0c493;font-size:12px;margin:0 8px}.pack-index span{color:#55524c}
.experience-footer{text-align:center;padding:12px 20px 24px;z-index:2}.wheel-controls{display:flex;align-items:center;justify-content:center;gap:24px}.round-button{width:44px;height:44px;border:1px solid #bda36e45;border-radius:50%;color:#d6c5a3;background:#ffffff04;font-size:27px;cursor:pointer}.gold-button{border:1px solid #e8c789;background:linear-gradient(110deg,#cfad70,#f0d7a7 50%,#c5a065);color:#302410;font:inherit;font-size:13px;font-weight:700;letter-spacing:2px;min-height:46px;padding:0 34px;border-radius:4px;cursor:pointer;box-shadow:0 3px 28px #c99e4820}.shuffle-button{min-width:180px}.shuffle-symbol{font-size:24px;vertical-align:middle;margin-right:12px}.pack-experience button:disabled{opacity:.35;cursor:wait}.pack-experience button:focus-visible{outline:2px solid #f7db9c;outline-offset:5px}.text-button{color:#c6b491;border:0;background:none;font:inherit;font-size:11px;cursor:pointer;padding:9px 14px}.choose-current{display:block;margin:4px auto 0}.ritual-steps{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:20px;color:#55514a;font-size:10px;letter-spacing:1px}.ritual-steps i{width:36px;height:1px;background:#ffffff15}.ritual-steps .current{color:#e5c487}.ritual-steps .done{color:#a89576}.opening-caption{font-size:9px;letter-spacing:1px;color:#665f53;margin:12px 0 0}.gesture-hint{color:#9e9079;font-size:11px;margin:0 0 15px}
.tear-seal{position:absolute;height:48px;padding:0;border:0;background:transparent;touch-action:none;cursor:ew-resize;z-index:3;outline:none}.seal-line{position:absolute;top:23px;left:0;right:0;border-top:1px dashed #fff4c6;filter:drop-shadow(0 0 3px #a97a17)}.seal-progress{position:absolute;top:23px;height:2px;background:#fff5ce;box-shadow:0 0 12px 3px #ffd679b0}.seal-dot{position:absolute;top:11px;width:24px;height:24px;border-radius:50%;border:1px solid #fce0a3;background:#6a522de0;color:white;font-size:19px;display:grid;place-items:center}.seal-dot.left{left:-12px}.seal-dot.right{right:-12px}.seal-label{position:absolute;top:-12px;left:50%;transform:translateX(-50%);font-size:10px;white-space:nowrap;color:#e0c28d;letter-spacing:2px;text-shadow:0 2px 8px #000}.scene-status{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;color:#c8b896;font-size:13px;padding:24px;text-align:center}.loading-ring{width:26px;height:26px;border:1px solid #b3966433;border-top-color:#d9b876;border-radius:50%;animation:spin 1.2s linear infinite}.handoff-panel{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px}.handoff-icon{border:1px solid #c9a770;border-radius:50%;width:70px;height:70px;display:grid;place-items:center;font-size:27px;color:#dfc08b;box-shadow:0 0 60px #c7a2591a}.handoff-panel h2{font-size:26px;font-weight:400;letter-spacing:4px;margin:24px 0 8px}.handoff-panel p{font-size:13px;color:#a39782}.handoff-panel .handoff-note{font-size:11px;color:#796e5c}.handoff-panel .gold-button{margin-top:20px}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:600px){.experience-header{padding:18px 20px}.opening-brand{font-size:17px}.opening-brand small{font-size:6px}.edition{max-width:40%;font-size:10px}.experience-intro{padding-top:10px}.experience-intro h1{letter-spacing:2px;font-size:23px}.experience-intro p{font-size:10px}.experience-footer{padding:4px 16px max(18px,env(safe-area-inset-bottom))}.ritual-steps{margin-top:16px;font-size:9px;gap:10px}.scene-area{min-height:130px}.wheel-controls{gap:20px}}
@media(max-height:650px){.experience-header{padding:12px 24px}.experience-intro h1{font-size:22px;margin:7px 0}.experience-footer{padding-bottom:10px}.ritual-steps{margin-top:10px}.opening-caption{margin-top:8px}.chapter{display:none}.scene-area{min-height:100px}}
.tear-seal .seal-line{top:23px;border:0;height:2px;background:#fff;filter:none;box-shadow:0 0 8px #ffffff70;transform-origin:left;animation:seal-sweep 1.65s ease-in-out infinite}
.tear-seal .seal-progress{left:0;top:23px;height:2px;background:#fff;box-shadow:0 0 8px #ffffff90}
.tear-seal.cutting .seal-line{opacity:.18;animation:none;transform:none}
.tear-seal.reduce-motion .seal-line{animation:none;transform:none}
@keyframes seal-sweep{0%,10%{transform:scaleX(0);opacity:0}18%{opacity:1}78%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
.pack-experience[data-stage="video"] .experience-intro{padding-top:0}.pack-experience[data-stage="video"] .experience-intro h1{font-size:18px;margin:2px 0 5px}.pack-experience[data-stage="video"] .experience-intro .chapter{display:none}.pack-experience[data-stage="video"] .experience-footer{padding-block:8px}.pack-experience[data-stage="video"] .ritual-steps{margin-top:0}.pack-experience[data-stage="video"] .opening-caption{display:none}
.pack-experience[data-stage="handoff"] .experience-header,.pack-experience[data-stage="handoff"] .experience-intro,.pack-experience[data-stage="handoff"] .experience-footer{display:none}
@media(prefers-reduced-motion:reduce){.loading-ring{animation:none}}
.tear-seal>.seal-line{position:absolute;left:0;top:17px;width:100%;height:14px;overflow:visible;background:none;border:0;box-shadow:none;filter:none;transform-origin:left;animation:wave-sweep 1.65s ease-in-out infinite}.tear-seal path{fill:none;stroke:#fff;stroke-width:1.15;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 3px #fff)}.tear-seal>.seal-progress{position:absolute;left:0;top:17px;height:14px;overflow:hidden;background:none;box-shadow:none}.tear-seal>.seal-progress svg{display:block;width:100%;height:14px;overflow:visible}.tear-seal>.seal-progress path{stroke:#f6d690;stroke-width:2}.tear-seal.cutting>.seal-line{opacity:.14;animation:none;transform:none}.tear-seal.reduce-motion>.seal-line{animation:none;transform:none}@keyframes wave-sweep{0%,10%{clip-path:inset(0 100% 0 0);opacity:0}18%{opacity:1}78%{clip-path:inset(0 0 0 0);opacity:1}100%{clip-path:inset(0 0 0 0);opacity:0}}.pack-experience[data-stage="tear"] .experience-intro,.pack-experience[data-stage="tear"] .experience-footer,.pack-experience[data-stage="opening"] .experience-intro,.pack-experience[data-stage="opening"] .experience-footer,.pack-experience[data-stage="video"] .experience-intro,.pack-experience[data-stage="video"] .experience-footer{display:none}
</style>
