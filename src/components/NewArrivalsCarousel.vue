<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { BlindBox } from '../data'

defineProps<{ boxes: BlindBox[] }>()

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function updateEdges() {
  const element = track.value
  if (!element) return
  atStart.value = element.scrollLeft <= 2
  atEnd.value = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2
}

function scroll(direction: -1 | 1) {
  const element = track.value
  if (!element) return

  if (window.matchMedia('(min-width: 1025px)').matches) {
    const cards = element.querySelectorAll<HTMLElement>('.arrival-card')
    const lastPageStart = cards[4] && cards[0]
      ? cards[4].offsetLeft - cards[0].offsetLeft
      : element.scrollWidth - element.clientWidth
    element.scrollTo({ left: direction > 0 ? lastPageStart : 0, behavior: 'smooth' })
    return
  }

  element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateEdges)
  window.addEventListener('resize', updateEdges)
})

onBeforeUnmount(() => window.removeEventListener('resize', updateEdges))
</script>

<template>
  <section id="new-arrivals" class="new-arrivals" aria-labelledby="new-arrivals-title">
    <div class="container arrivals-inner">
      <header class="arrivals-heading">
        <span class="arrivals-eyebrow">NEW ARRIVALS</span>
        <h2 id="new-arrivals-title">新品上线</h2>
        <RouterLink to="/blind-boxes">查看全部新品</RouterLink>
      </header>

      <div class="arrivals-toolbar">
        <strong>本周上新</strong>
        <span aria-hidden="true"></span>
        <div class="arrivals-controls">
          <button type="button" aria-label="查看上一组新品" :disabled="atStart" @click="scroll(-1)">‹</button>
          <button type="button" aria-label="查看下一组新品" :disabled="atEnd" @click="scroll(1)">›</button>
        </div>
      </div>

      <div
        ref="track"
        class="arrivals-track"
        role="region"
        aria-label="新品盲盒横向列表"
        tabindex="0"
        @scroll.passive="updateEdges"
      >
        <RouterLink
          v-for="box in boxes"
          :key="box.id"
          class="arrival-card"
          :to="`/blind-boxes/${box.id}`"
        >
          <div class="arrival-image">
            <img :src="box.image" :alt="box.name" loading="lazy">
          </div>
          <h3>{{ box.name }}</h3>
          <div class="arrival-tags" aria-label="商品标签">
            <span v-for="(tag, index) in box.tags" :key="tag" :class="{ gold: index === 0 }">{{ tag }}</span>
          </div>
          <div class="arrival-price">
            <strong>{{ box.price }} <small>OK Coin</small></strong>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.new-arrivals{padding:72px 0 88px;background:#fff;overflow:hidden}.arrivals-inner{width:min(1440px,calc(100% - 40px));margin-inline:auto}.arrivals-heading{text-align:center}.arrivals-eyebrow{color:var(--brown);font-size:12px;font-weight:800;letter-spacing:.13em}.arrivals-heading h2{margin:7px 0 10px;color:#111;font-size:clamp(30px,3vw,42px);line-height:1.15;font-weight:900}.arrivals-heading a{display:inline-block;color:#161616;font-size:14px;text-decoration:underline;text-underline-offset:5px}.arrivals-toolbar{display:flex;align-items:center;gap:24px;margin-top:48px}.arrivals-toolbar>strong{flex:0 0 auto;color:#111;font-size:20px;font-weight:900}.arrivals-toolbar>span{height:1px;flex:1;background:#dedede}.arrivals-controls{display:flex;gap:8px}.arrivals-controls button{width:44px;height:44px;padding:0;border:0;border-radius:50%;display:grid;place-items:center;background:#202020;color:#fff;font-size:29px;line-height:1;transition:background .2s,color .2s,transform .2s}.arrivals-controls button:hover:not(:disabled),.arrivals-controls button:focus-visible:not(:disabled){background:#000;transform:translateY(-1px)}.arrivals-controls button:focus-visible{outline:3px solid rgba(112,93,0,.28);outline-offset:2px}.arrivals-controls button:disabled{cursor:not-allowed;background:#ededed;color:#b8b8b8}.arrivals-track{width:calc(100% + 144px);max-width:calc(100vw - 64px - max(20px,calc((100vw - 1440px)/2)));display:flex;gap:24px;margin-top:18px;padding-bottom:2px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-behavior:smooth;scroll-snap-type:x mandatory;scrollbar-width:none}.arrivals-track::after{content:"";flex:0 0 max(0px,calc(100% - 1440px));margin-left:-24px}.arrivals-track::-webkit-scrollbar{display:none}.arrivals-track:focus-visible{outline:2px solid var(--brown);outline-offset:6px}.arrival-card{width:342px;flex:0 0 auto;scroll-snap-align:start;color:#151515}.arrival-image{aspect-ratio:5/7;overflow:hidden;background:radial-gradient(circle at 50% 38%,#fff 0 17%,transparent 52%),linear-gradient(145deg,#fff6b8,#ffd552)}.arrival-card:nth-child(2n) .arrival-image{background:radial-gradient(circle at 50% 38%,#fff 0 17%,transparent 52%),linear-gradient(145deg,#e8f4ff,#a9d3ff)}.arrival-card:nth-child(3n) .arrival-image{background:radial-gradient(circle at 50% 38%,#fff 0 17%,transparent 52%),linear-gradient(145deg,#f4e8ff,#c9a8ff)}.arrival-image img{width:100%;height:100%;padding:28px;object-fit:contain;object-position:center;filter:drop-shadow(0 18px 18px rgba(55,43,4,.2));transition:transform .3s ease}.arrival-card:hover .arrival-image img,.arrival-card:focus-visible .arrival-image img{transform:scale(1.025)}.arrival-card:focus-visible{outline:2px solid var(--brown);outline-offset:4px}.arrival-card h3{min-height:45px;margin:17px 0 9px;font-size:16px;line-height:1.4;font-weight:800}.arrival-tags{min-height:27px;display:flex;align-items:flex-start;flex-wrap:wrap;gap:6px}.arrival-tags span{padding:4px 9px;border-radius:999px;background:#f1f1ed;color:#57564f;font-size:11px;font-weight:700;line-height:1.35}.arrival-tags span.gold{background:#fff2aa;color:#665500}.arrival-price{margin-top:14px;text-align:left}.arrival-price strong{display:block;white-space:nowrap;color:#111;font-size:20px;line-height:1;font-weight:800}.arrival-price small{font-size:11px;font-weight:800}
@media(max-width:1024px){.arrivals-track{width:100%;gap:22px}.arrivals-track::after{display:none}.arrival-card{width:clamp(270px,36vw,310px)}}
@media(max-width:767px){.new-arrivals{padding:52px 0 62px}.arrivals-inner{width:calc(100% - 28px)}.arrivals-heading h2{font-size:30px}.arrivals-toolbar{gap:13px;margin-top:36px}.arrivals-toolbar>strong{font-size:17px}.arrivals-controls{gap:6px}.arrivals-controls button{width:38px;height:38px;font-size:25px}.arrivals-track{gap:14px;margin-top:15px}.arrival-card{width:min(82vw,310px)}.arrival-card h3{margin-top:14px}}
</style>
