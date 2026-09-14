<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { cards, type BlindBox } from '../data'
import { useAppStore } from '../stores/app'
import { PACK_COVER, PACK_VIDEO } from './pack-opening/types'
let packOpeningPromise: Promise<typeof import('./pack-opening/PackOpening.vue')> | undefined
const loadPackOpening = () => packOpeningPromise ??= import('./pack-opening/PackOpening.vue')
const PackOpening = defineAsyncComponent(loadPackOpening)
const p = defineProps<{ box: BlindBox | null; count: number }>()
const emit = defineEmits(['close'])
const store = useAppStore(), stage = ref<'confirm' | 'opening'>('confirm')
const { t } = useI18n()
const cost = computed(() => p.box ? p.box.price * p.count : 0)
const openingVideo = import.meta.env.VITE_PACK_OPENING_VIDEO_URL || PACK_VIDEO
let videoPreload: HTMLVideoElement | undefined
const results = computed(() => Array.from({ length: p.count }, (_, index) => {
  const card = cards[index % cards.length]
  const key = ['pikachu','gengar','mewtwo','eevee'][index % cards.length]
  return { name: t(`cards.${key}.name`), rarity: card.tag.includes('PSA') ? card.tag : 'RARE', coin: card.coin, image: card.image }
}))
function warmOpening() {
  void loadPackOpening()
  const cover = new Image()
  cover.decoding = 'async'
  cover.src = PACK_COVER
  void cover.decode().catch(() => undefined)
  if (!videoPreload) {
    videoPreload = document.createElement('video')
    videoPreload.preload = 'auto'
    videoPreload.playsInline = true
    videoPreload.src = openingVideo
    videoPreload.load()
  }
}
watch(() => p.box, box => {
  stage.value = 'confirm'
  if (box) warmOpening()
})
onMounted(warmOpening)
function buy() {
  if (stage.value !== 'confirm' || !p.box) return
  if (!store.spend(cost.value)) { store.toast(t('draw.insufficient')); return }
  stage.value = 'opening'
}
</script>
<template>
  <PackOpening v-if="box && stage==='opening'" :title="t(`boxes.${box.id}.name`)" :count="count" :results="results" :reduced-motion="store.reducedMotion" :video-src="openingVideo" @complete="stage='confirm'" @close="emit('close')"/>
  <div v-else-if="box" class="overlay" @click.self="emit('close')">
    <div v-if="stage==='confirm'" class="modal">
      <span class="eyebrow">{{t('draw.confirm')}}</span><h2>{{t(`boxes.${box.id}.name`)}}</h2>
      <div class="confirm-box"><p><span>{{t('draw.times')}}</span><b>{{t('draw.timesValue',{count})}}</b></p><p><span>{{t('draw.cost')}}</span><b>{{cost.toLocaleString()}} OK Coin</b></p><p><span>{{t('draw.balance')}}</span><b>{{store.balance.toLocaleString()}} OK Coin</b></p><p><span>{{t('draw.after')}}</span><b>{{Math.max(0,store.balance-cost).toLocaleString()}} OK Coin</b></p></div>
      <div class="notice">{{t('draw.notice')}}</div>
      <div class="modal-actions"><button class="btn btn-outline" @click="emit('close')">{{t('common.cancel')}}</button><RouterLink v-if="store.balance<cost" to="/recharge" class="btn btn-primary" @click="emit('close')">{{t('draw.recharge')}}</RouterLink><button v-else class="btn btn-primary" @click="buy">{{t('draw.buy')}}</button></div>
    </div>
  </div>
</template>
<style scoped>.confirm-box{background:#f7f7f3;border-radius:13px;padding:12px 18px;margin:20px 0}.confirm-box p{display:flex;justify-content:space-between;margin:10px 0;font-size:14px}.notice{font-size:12px;line-height:1.7;color:#6d6226;background:#fff9d9;border:1px solid #f1df72;padding:13px;border-radius:10px}.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}</style>
