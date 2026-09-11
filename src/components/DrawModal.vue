<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { cards, type BlindBox } from '../data'
import { useAppStore } from '../stores/app'
import { PACK_COVER, PACK_VIDEO } from './pack-opening/types'
let packOpeningPromise: Promise<typeof import('./pack-opening/PackOpening.vue')> | undefined
const loadPackOpening = () => packOpeningPromise ??= import('./pack-opening/PackOpening.vue')
const PackOpening = defineAsyncComponent(loadPackOpening)
const p = defineProps<{ box: BlindBox | null; count: number }>()
const emit = defineEmits(['close'])
const store = useAppStore(), stage = ref<'confirm' | 'opening'>('confirm')
const cost = computed(() => p.box ? p.box.price * p.count : 0)
const openingVideo = import.meta.env.VITE_PACK_OPENING_VIDEO_URL || PACK_VIDEO
let videoPreload: HTMLVideoElement | undefined
const results = computed(() => Array.from({ length: p.count }, (_, index) => {
  const card = cards[index % cards.length]
  return { name: card.name, rarity: card.tag.includes('PSA') ? card.tag : 'RARE', coin: card.coin, image: card.image }
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
  if (!store.spend(cost.value)) { store.toast('余额不足，请先充值'); return }
  stage.value = 'opening'
}
</script>
<template>
  <PackOpening v-if="box && stage==='opening'" :title="box.name" :count="count" :results="results" :reduced-motion="store.reducedMotion" :video-src="openingVideo" @complete="stage='confirm'" @close="emit('close')"/>
  <div v-else-if="box" class="overlay" @click.self="emit('close')">
    <div v-if="stage==='confirm'" class="modal">
      <span class="eyebrow">购买确认</span><h2>{{box.name}}</h2>
      <div class="confirm-box"><p><span>抽取次数</span><b>{{count}} 次</b></p><p><span>本次消耗</span><b>{{cost.toLocaleString()}} OK Coin</b></p><p><span>当前余额</span><b>{{store.balance.toLocaleString()}} OK Coin</b></p><p><span>购买后余额</span><b>{{Math.max(0,store.balance-cost).toLocaleString()}} OK Coin</b></p></div>
      <div class="notice">概率会随剩余库存动态变化。十连抽不打折，也不存在累计保底或额外必出机制。确认购买后进入选包与开包动画。</div>
      <div class="modal-actions"><button class="btn btn-outline" @click="emit('close')">取消</button><RouterLink v-if="store.balance<cost" to="/recharge" class="btn btn-primary" @click="emit('close')">去充值</RouterLink><button v-else class="btn btn-primary" @click="buy">确认购买</button></div>
    </div>
  </div>
</template>
<style scoped>.confirm-box{background:#f7f7f3;border-radius:13px;padding:12px 18px;margin:20px 0}.confirm-box p{display:flex;justify-content:space-between;margin:10px 0;font-size:14px}.notice{font-size:12px;line-height:1.7;color:#6d6226;background:#fff9d9;border:1px solid #f1df72;padding:13px;border-radius:10px}.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}</style>
