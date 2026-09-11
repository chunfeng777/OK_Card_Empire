<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import type { BlindBox } from '../data'
import { useAppStore } from '../stores/app'
import { PACK_VIDEO } from './pack-opening/types'
const PackOpening = defineAsyncComponent(() => import('./pack-opening/PackOpening.vue'))
const p = defineProps<{ box: BlindBox | null; count: number }>()
const emit = defineEmits(['close'])
const store = useAppStore(), stage = ref<'confirm' | 'opening' | 'result'>('confirm')
const cost = computed(() => p.box ? p.box.price * p.count : 0)
const openingVideo = import.meta.env.VITE_PACK_OPENING_VIDEO_URL || PACK_VIDEO
watch(() => p.box, () => { stage.value = 'confirm' })
function buy() {
  if (stage.value !== 'confirm' || !p.box) return
  if (!store.spend(cost.value)) { store.toast('余额不足，请先充值'); return }
  stage.value = 'opening'
}
</script>
<template>
  <PackOpening v-if="box && stage==='opening'" :title="box.name" :count="count" :reduced-motion="store.reducedMotion" :video-src="openingVideo" @complete="stage='result'" @close="stage='result'"/>
  <div v-else-if="box" class="overlay" @click.self="emit('close')">
    <div v-if="stage==='confirm'" class="modal">
      <span class="eyebrow">购买确认</span><h2>{{box.name}}</h2>
      <div class="confirm-box"><p><span>抽取次数</span><b>{{count}} 次</b></p><p><span>本次消耗</span><b>{{cost.toLocaleString()}} OK Coin</b></p><p><span>当前余额</span><b>{{store.balance.toLocaleString()}} OK Coin</b></p><p><span>购买后余额</span><b>{{Math.max(0,store.balance-cost).toLocaleString()}} OK Coin</b></p></div>
      <div class="notice">概率会随剩余库存动态变化。十连抽不打折，也不存在累计保底或额外必出机制。确认购买后进入选包与开包动画。</div>
      <div class="modal-actions"><button class="btn btn-outline" @click="emit('close')">取消</button><RouterLink v-if="store.balance<cost" to="/recharge" class="btn btn-primary" @click="emit('close')">去充值</RouterLink><button v-else class="btn btn-primary" @click="buy">确认购买</button></div>
    </div>
    <div v-else class="modal result"><span class="eyebrow">抽取结果</span><h2>恭喜获得收藏卡牌</h2><div class="result-grid"><div v-for="n in count" :key="n" class="mini-card"><img :src="box.image" :alt="box.name"><strong>{{n%3===0?'超梦 GX':'皮卡丘 VMAX'}}</strong><span>{{n%3===0?'800':'2,000'}} Coin</span></div></div><p class="muted">卡牌已自动进入卡牌仓库。</p><div class="modal-actions"><button class="btn btn-outline" @click="stage='confirm'">继续抽取</button><button class="btn btn-primary" @click="store.toast('已进入回收选择模式');emit('close')">回收所选卡牌</button></div></div>
  </div>
</template>
<style scoped>.confirm-box{background:#f7f7f3;border-radius:13px;padding:12px 18px;margin:20px 0}.confirm-box p{display:flex;justify-content:space-between;margin:10px 0;font-size:14px}.notice{font-size:12px;line-height:1.7;color:#6d6226;background:#fff9d9;border:1px solid #f1df72;padding:13px;border-radius:10px}.modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}.result{width:min(850px,100%)}.result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin:20px 0}.mini-card{border:1px solid var(--line);border-radius:10px;padding:8px;display:grid;gap:5px;font-size:11px}.mini-card img{width:100%;aspect-ratio:3/4;padding:9px;object-fit:contain;border-radius:7px;background:linear-gradient(145deg,#fff6ad,#c8e3ff)}.mini-card span{color:var(--brown)}</style>
