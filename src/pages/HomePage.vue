<script setup lang="ts">
import { ref } from 'vue'
import { boxes, images, type BlindBox } from '../data'
import BlindBoxCard from '../components/BlindBoxCard.vue'
import DrawModal from '../components/DrawModal.vue'
const chosen=ref<BlindBox|null>(null),count=ref(1),faq=ref(-1)
const faqs=['如何保证卡池概率透明？','新用户 100 Coin 如何领取？','抽中的卡牌如何回收？','何时可以申请实物发货？','十连抽是否有额外保底？','OK Coin 是否可以提现？']
function draw(b:BlindBox,n:number){chosen.value=b;count.value=n}
</script>
<template>
<main>
  <section class="hero">
    <div class="hero-bg" :style="{backgroundImage:`url(${images.hero})`}"></div><div class="hero-shade"></div>
    <div class="container hero-content"><span class="hero-chip">宝可梦官方授权 · 限量卡池</span><h1>收藏热爱，<br><em>每次开启都有惊喜</em></h1><p>真实有限库存，概率随剩余卡牌动态更新。每次抽取必得一张收藏卡。</p><div><RouterLink to="/blind-boxes" class="btn btn-primary">探索盲盒</RouterLink><a href="#trust" class="btn hero-link">了解保障</a></div></div>
    <div class="hero-dots">● ○ ○</div>
  </section>
  <section class="benefit"><div class="container benefit-card"><div><span class="eyebrow">NEW COLLECTOR</span><h2>新用户激活即得 100 Coin</h2><p>完成邮箱、手机号双绑定与 18+ 确认后领取。福利盲盒资格保留 24 小时。</p></div><div class="gift-coin">100<small>OK Coin</small></div><RouterLink to="/register" class="btn btn-dark">立即注册领取</RouterLink></div></section>
  <section class="container home-section"><div class="section-head"><div><span class="eyebrow">NEW ARRIVALS</span><h2 class="section-title">新品上线</h2></div><RouterLink to="/blind-boxes">查看全部 →</RouterLink></div><div class="box-grid"><BlindBoxCard v-for="b in boxes.slice(0,4)" :key="b.id" :box="b" @draw="draw"/></div></section>
  <section class="feature-band"><div class="container"><div class="section-head"><div><span class="eyebrow">TRENDING NOW</span><h2 class="section-title">热门必抢盲盒</h2></div></div><div class="box-grid"><BlindBoxCard v-for="b in boxes.slice(4,8)" :key="b.id" :box="b" @draw="draw"/></div></div></section>
  <section id="trust" class="container home-section"><div class="center"><span class="eyebrow">WHY OK CARD EMPIRE</span><h2 class="section-title">放心收藏，透明体验</h2></div><div class="trust-grid"><article><i>◆</i><h3>官方授权</h3><p>宝可梦官方授权卡牌，商品信息清晰可追溯。</p></article><article><i>◫</i><h3>概率透明</h3><p>公开初始库存、剩余库存与实时动态概率。</p></article><article><i>↻</i><h3>灵活回收</h3><p>保管中的卡牌可按页面锁定 Coin 进行回收。</p></article><article><i>▱</i><h3>实物配送</h3><p>卡牌合计达到 2,000 Coin 即可申请标准包邮。</p></article></div></section>
  <section class="faq-preview"><div class="container faq-layout"><div><span class="eyebrow">HELP CENTER</span><h2 class="section-title">收藏之前，<br>你可能想知道</h2><RouterLink to="/faq" class="btn btn-outline">查看更多问题</RouterLink></div><div class="faq-list"><button v-for="(q,i) in faqs" :key="q" @click="faq=faq===i?-1:i"><span>{{q}}</span><b>{{faq===i?'−':'+'}}</b><p v-if="faq===i">所有规则均以当前页面展示和订单最终状态为准。如需进一步帮助，可提交客服工单。</p></button></div></div></section>
  <DrawModal :box="chosen" :count="count" @close="chosen=null"/>
</main>
</template>
<style scoped>
.hero{height:min(650px,72vh);min-height:520px;position:relative;display:flex;align-items:center;color:#fff;overflow:hidden}.hero-bg,.hero-shade{position:absolute;inset:0}.hero-bg{background-size:cover;background-position:center}.hero-shade{background:linear-gradient(90deg,rgba(14,13,4,.8),rgba(14,13,4,.25) 60%,rgba(14,13,4,.05))}.hero-content{position:relative}.hero-chip{display:inline-block;border:1px solid rgba(255,255,255,.5);border-radius:99px;padding:7px 14px;font-size:12px}.hero h1{font-size:clamp(44px,6vw,78px);line-height:1.07;margin:22px 0}.hero h1 em{font-style:normal;color:#ffe866}.hero p{max-width:570px;font-size:17px;line-height:1.8;color:rgba(255,255,255,.86)}.hero-content>div{display:flex;gap:12px;margin-top:30px}.hero-link{color:white;border:1px solid rgba(255,255,255,.5)}.hero-dots{position:absolute;bottom:20px;left:50%;letter-spacing:8px}.benefit{background:#fff;padding:28px 0}.benefit-card{background:linear-gradient(110deg,#fff4a0,#ffd700);border-radius:18px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:32px;padding:28px 38px}.benefit h2{margin:5px 0}.benefit p{margin:0;color:#655c29}.gift-coin{font-size:42px;font-weight:900;color:var(--brown)}.gift-coin small{font-size:12px;display:block;text-align:center}.home-section{padding:80px 0}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:28px}.section-head a{color:var(--brown);font-weight:700}.box-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.feature-band{background:#f1f1ec;padding:78px 0}.center{text-align:center}.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}.trust-grid article{padding:28px;text-align:center}.trust-grid i{width:54px;height:54px;background:#fff4a8;color:var(--brown);display:grid;place-items:center;border-radius:50%;margin:auto;font-size:22px}.trust-grid p{font-size:13px;color:var(--muted);line-height:1.7}.faq-preview{background:#f1f1ec;padding:78px 0}.faq-layout{display:grid;grid-template-columns:1fr 1.7fr;gap:70px}.faq-list{border-top:1px solid #d8d7cf}.faq-list button{width:100%;text-align:left;border:0;border-bottom:1px solid #d8d7cf;background:transparent;padding:20px 3px;font-weight:700}.faq-list button span{display:inline-block;width:calc(100% - 30px)}.faq-list button b{float:right}.faq-list p{font-weight:400;color:var(--muted);line-height:1.7}
@media(max-width:960px){.box-grid{grid-template-columns:repeat(2,1fr)}.trust-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.hero{min-height:540px}.hero h1{font-size:42px}.benefit-card{grid-template-columns:1fr;text-align:center;padding:26px}.box-grid{grid-template-columns:1fr}.trust-grid{grid-template-columns:1fr 1fr}.faq-layout{grid-template-columns:1fr;gap:30px}.home-section,.feature-band,.faq-preview{padding:52px 0}}
</style>
