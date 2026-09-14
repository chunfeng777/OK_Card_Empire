<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { boxes, type BlindBox } from '../data'
import BlindBoxCard from '../components/BlindBoxCard.vue'
import DrawModal from '../components/DrawModal.vue'
const chosen=ref<BlindBox|null>(null),count=ref(1),faq=ref(-1)
const { t, tm } = useI18n()
const faqs=computed(()=>tm('home.faqs') as string[])
const trustItems=computed(()=>tm('home.trust') as string[][])
const liveWins=computed(()=>{
  const names=tm('homeFeed.names') as string[],times=tm('homeFeed.times') as string[]
  return [
    {user:'Ka***',name:names[0],rarity:'UR',coin:'24,800',time:times[0]},
    {user:'Mi***',name:names[1],rarity:'SSR',coin:'8,200',time:times[1]},
    {user:'St***',name:names[2],rarity:'SR',coin:'2,400',time:times[2]},
    {user:'Ry***',name:names[3],rarity:'HR',coin:'12,600',time:times[3]},
    {user:'Lu***',name:names[4],rarity:'SR',coin:'3,800',time:times[4]},
  ]
})
const slides=computed(()=>[
  {theme:'electric',characters:['/images/pokemon/pikachu.png','/images/pokemon/eevee.png','/images/pokemon/charizard.png'],title:t('home.hero.0'),route:'/blind-boxes'},
  {theme:'starlight',characters:['/images/pokemon/pikachu.png','/images/pokemon/mewtwo.png'],title:t('home.hero.1'),route:'/blind-boxes/pokemon-starlight'},
  {theme:'forest',characters:['/images/pokemon/eevee.png','/images/pokemon/bulbasaur.png','/images/pokemon/squirtle.png'],title:t('home.hero.2'),route:'/blind-boxes/eevee-evolution'},
])
const activeSlide=ref(0),progressKey=ref(0),reducedMotion=ref(false)
let autoplayTimer:ReturnType<typeof setTimeout>|undefined
let mediaQuery:MediaQueryList|undefined
let hovering=false,focusWithin=false,touchStartX=0

function stopAutoplay(){if(autoplayTimer){clearTimeout(autoplayTimer);autoplayTimer=undefined}}
function startAutoplay(){
  stopAutoplay()
  if(reducedMotion.value||hovering||focusWithin)return
  autoplayTimer=setTimeout(()=>goTo(activeSlide.value+1),5000)
}
function goTo(index:number){
  activeSlide.value=(index+slides.value.length)%slides.value.length
  progressKey.value++
  startAutoplay()
}
function pauseForHover(){hovering=true;stopAutoplay()}
function resumeFromHover(){hovering=false;progressKey.value++;startAutoplay()}
function pauseForFocus(){focusWithin=true;stopAutoplay()}
function resumeFromFocus(event:FocusEvent){
  if(event.currentTarget instanceof HTMLElement&&event.relatedTarget instanceof Node&&event.currentTarget.contains(event.relatedTarget))return
  focusWithin=false
  progressKey.value++
  startAutoplay()
}
function onTouchStart(event:TouchEvent){touchStartX=event.changedTouches[0]?.clientX??0;stopAutoplay()}
function onTouchEnd(event:TouchEvent){
  const distance=(event.changedTouches[0]?.clientX??touchStartX)-touchStartX
  if(Math.abs(distance)>=45)goTo(activeSlide.value+(distance<0?1:-1))
  else{progressKey.value++;startAutoplay()}
}
function syncMotionPreference(event?:MediaQueryListEvent){
  reducedMotion.value=event?.matches??mediaQuery?.matches??false
  if(reducedMotion.value)stopAutoplay()
  else startAutoplay()
}
onMounted(()=>{
  mediaQuery=window.matchMedia('(prefers-reduced-motion: reduce)')
  syncMotionPreference()
  mediaQuery.addEventListener('change',syncMotionPreference)
})
onBeforeUnmount(()=>{stopAutoplay();mediaQuery?.removeEventListener('change',syncMotionPreference)})
function draw(b:BlindBox,n:number){chosen.value=b;count.value=n}
</script>
<template>
<main>
  <section class="hero container" :class="{reduced:reducedMotion}" :aria-label="t('home.heroAria')" @mouseenter="pauseForHover" @mouseleave="resumeFromHover" @focusin="pauseForFocus" @focusout="resumeFromFocus" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <div v-for="(slide,index) in slides" :key="slide.title" class="hero-slide" :class="[slide.theme,{active:index===activeSlide}]" :aria-hidden="index!==activeSlide"><img v-for="(character,characterIndex) in slide.characters" :key="character" :src="character" alt="" class="hero-pokemon-art" :class="`pokemon-${characterIndex+1}`"></div>
    <div class="hero-gradient"></div>
    <button class="hero-arrow hero-prev" type="button" :aria-label="t('home.previous')" @click="goTo(activeSlide-1)">‹</button>
    <button class="hero-arrow hero-next" type="button" :aria-label="t('home.next')" @click="goTo(activeSlide+1)">›</button>
    <div class="hero-caption" aria-live="polite">
      <h1>{{slides[activeSlide].title}}</h1>
      <RouterLink :to="slides[activeSlide].route">{{t('home.explore')}}</RouterLink>
    </div>
    <div class="hero-pagination" :aria-label="t('home.chooseSlide')">
      <button v-for="(_,index) in slides" :key="`${index}-${progressKey}`" type="button" :aria-label="t('home.viewSlide',{number:index+1})" :aria-current="index===activeSlide?'true':undefined" @click="goTo(index)"><span :class="{active:index===activeSlide}"></span></button>
    </div>
  </section>
  <section class="live-feed container" :aria-label="t('home.live')">
    <div class="feed-viewport">
      <div class="feed-track">
        <div v-for="group in 2" :key="group" class="feed-group" :aria-hidden="group===2">
          <div v-for="(win,index) in liveWins" :key="`${group}-${index}`" class="feed-item">
            <i aria-hidden="true"></i><span class="feed-user">{{win.user}}</span><b>{{t('home.won')}}</b><strong>{{win.name}}</strong><em>{{win.rarity}}</em><span class="feed-coin">◆ {{win.coin}}</span><small>{{win.time}}</small>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="feature-band"><div class="container"><div class="section-head"><div><span class="eyebrow">{{t('eyebrow.trending')}}</span><h2 class="section-title">{{t('home.trending')}}</h2></div><RouterLink to="/blind-boxes" class="all-boxes-link">{{t('home.viewAll')}} <span>→</span></RouterLink></div><div class="box-grid"><BlindBoxCard v-for="b in boxes.slice(4,8)" :key="b.id" :box="b" @draw="draw"/></div></div></section>
  <section id="trust" class="container home-section"><div class="center"><span class="eyebrow">{{t('eyebrow.trust')}}</span><h2 class="section-title">{{t('home.trustTitle')}}</h2></div><div class="trust-grid"><article v-for="(item,index) in trustItems" :key="item[0]"><i>{{['◆','◫','↻','▱'][index]}}</i><h3>{{item[0]}}</h3><p>{{item[1]}}</p></article></div></section>
  <section class="faq-preview"><div class="container faq-layout"><div><span class="eyebrow">{{t('eyebrow.help')}}</span><h2 class="section-title faq-title">{{t('home.faqTitle')}}</h2><RouterLink to="/faq" class="btn btn-outline">{{t('home.moreQuestions')}}</RouterLink></div><div class="faq-list"><button v-for="(q,i) in faqs" :key="q" @click="faq=faq===i?-1:i"><span>{{q}}</span><b>{{faq===i?'−':'+'}}</b><p v-if="faq===i">{{t('home.faqAnswer')}}</p></button></div></div></section>
  <DrawModal :box="chosen" :count="count" @close="chosen=null"/>
</main>
</template>
<style scoped>
.faq-title{white-space:pre-line}
.hero{height:calc(100vh - 72px);height:calc(100dvh - 72px);position:relative;color:#fff;overflow:hidden}.hero-slide,.hero-gradient{position:absolute;inset:0}.hero-slide{opacity:0;transition:opacity .75s ease;background:#ffd633;isolation:isolate}.hero-slide::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 36%,rgba(255,255,255,.82),transparent 28%),repeating-linear-gradient(125deg,rgba(255,255,255,.08) 0 2px,transparent 2px 22px);z-index:-1}.hero-slide.starlight{background:linear-gradient(135deg,#19143e,#5245a8 55%,#ffe14f)}.hero-slide.forest{background:linear-gradient(135deg,#b9ed9e,#55b997 58%,#a8d7ff)}.hero-pokemon-art{position:absolute;bottom:1%;left:50%;width:min(40vw,680px);height:88%;object-fit:contain;filter:drop-shadow(0 28px 22px rgba(32,25,5,.28));transform:translateX(-50%)}.hero-pokemon-art.pokemon-1{z-index:3}.hero-pokemon-art.pokemon-2{left:20%;width:min(28vw,480px);height:64%;z-index:2}.hero-pokemon-art.pokemon-3{left:80%;width:min(30vw,500px);height:68%;z-index:1}.hero-slide.active{opacity:1}.hero-gradient{background:linear-gradient(180deg,transparent 44%,rgba(0,0,0,.7) 100%);pointer-events:none}.hero-arrow{position:absolute;z-index:2;top:50%;width:46px;height:46px;border:0;border-radius:50%;background:rgba(0,0,0,.2);color:#fff;font-size:34px;line-height:1;display:grid;place-items:center;transform:translateY(-50%);cursor:pointer;transition:background .2s}.hero-arrow:hover,.hero-arrow:focus-visible{background:rgba(0,0,0,.48);outline:2px solid #fff;outline-offset:2px}.hero-prev{left:18px}.hero-next{right:18px}.hero-caption{position:absolute;z-index:2;bottom:76px;left:50%;width:min(900px,calc(100% - 120px));text-align:center;transform:translateX(-50%);text-shadow:0 2px 16px rgba(0,0,0,.55)}.hero-caption h1{margin:0 0 17px;font-size:30px;line-height:1.2}.hero-caption a{color:#fff;font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:5px}.hero-pagination{position:absolute;z-index:2;bottom:18px;left:50%;display:flex;gap:12px;transform:translateX(-50%)}.hero-pagination button{width:108px;height:14px;padding:6px 0;border:0;background:transparent;cursor:pointer}.hero-pagination button::before{content:'';display:block;width:100%;height:2px;background:rgba(255,255,255,.42)}.hero-pagination span{display:block;width:0;height:2px;margin-top:-2px;background:#fff}.hero-pagination span.active{animation:hero-progress 5s linear forwards}.hero:hover .hero-pagination span.active,.hero:focus-within .hero-pagination span.active{animation-play-state:paused}.hero.reduced .hero-slide{transition:none}.hero.reduced .hero-pagination span.active{width:100%;animation:none}@keyframes hero-progress{from{width:0}to{width:100%}}.benefit{background:#fff;padding:28px 0}.benefit-card{background:linear-gradient(110deg,#fff4a0,#ffd700);border-radius:18px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:32px;padding:28px 38px}.benefit h2{margin:5px 0}.benefit p{margin:0;color:#655c29}.gift-coin{font-size:42px;font-weight:900;color:var(--brown)}.gift-coin small{font-size:12px;display:block;text-align:center}.home-section{padding:80px 0}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:28px}.section-head a{color:var(--brown);font-weight:700}.box-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.feature-band{background:#f1f1ec;padding:78px 0}.center{text-align:center}.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}.trust-grid article{padding:28px;text-align:center}.trust-grid i{width:54px;height:54px;background:#fff4a8;color:var(--brown);display:grid;place-items:center;border-radius:50%;margin:auto;font-size:22px}.trust-grid p{font-size:13px;color:var(--muted);line-height:1.7}.faq-preview{background:#f1f1ec;padding:78px 0}.faq-layout{display:grid;grid-template-columns:1fr 1.7fr;gap:70px}.faq-list{border-top:1px solid #d8d7cf}.faq-list button{width:100%;text-align:left;border:0;border-bottom:1px solid #d8d7cf;background:transparent;padding:20px 3px;font-weight:700}.faq-list button span{display:inline-block;width:calc(100% - 30px)}.faq-list button b{float:right}.faq-list p{font-weight:400;color:var(--muted);line-height:1.7}
@media(max-width:960px){.box-grid{grid-template-columns:repeat(2,1fr)}.trust-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:767px){.hero{height:calc(100vh - 64px);height:calc(100dvh - 64px)}.hero-pokemon-art{width:72vw;height:72%;bottom:10%}.hero-pokemon-art.pokemon-2{left:9%;width:48vw;height:44%}.hero-pokemon-art.pokemon-3{left:91%;width:48vw;height:46%}.hero-caption{bottom:64px;width:calc(100% - 70px)}.hero-caption h1{font-size:23px}.hero-arrow{width:38px;height:38px;font-size:28px}.hero-prev{left:10px}.hero-next{right:10px}.hero-pagination{width:calc(100% - 70px);gap:8px}.hero-pagination button{width:auto;flex:1;min-width:0}}
@media(max-width:600px){.benefit-card{grid-template-columns:1fr;text-align:center;padding:26px}.box-grid{grid-template-columns:1fr}.trust-grid{grid-template-columns:1fr 1fr}.faq-layout{grid-template-columns:1fr;gap:30px}.home-section,.feature-band,.faq-preview{padding:52px 0}}
.hero{height:clamp(420px,54vh,580px);margin-top:18px;border-radius:20px}.hero-pokemon-art{height:91%}.hero-caption{bottom:64px}.hero-pagination{bottom:16px}
.live-feed{margin-top:18px;padding:0;border:1px solid #d9bd4f66;border-radius:16px;overflow:hidden;background:linear-gradient(110deg,#17170e,#25220e 52%,#17170e);box-shadow:0 10px 30px rgba(74,61,0,.1)}.feed-viewport{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}.feed-track{display:flex;width:max-content;animation:feed-scroll 34s linear infinite}.feed-group{display:flex;flex:none}.feed-item{display:flex;align-items:center;gap:8px;min-width:max-content;padding:14px 28px;border-right:1px solid #fff2a614;color:#d8d3bc;font-size:12px;white-space:nowrap}.feed-item i{width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 9px #ffd700}.feed-item:nth-child(3n+2) i{background:#7ae6ff;box-shadow:0 0 9px #36cdeb}.feed-item:nth-child(3n) i{background:#bd8cff;box-shadow:0 0 9px #9d68e8}.feed-user,.feed-item small{color:#777463}.feed-item b{color:#f6f1dc}.feed-item strong{color:#f0cd46}.feed-item em{padding:3px 6px;border-radius:5px;background:#d3ae21;color:#19170b;font-size:9px;font-style:normal;font-weight:900}.feed-coin{color:#5de0a6;font-weight:800}@keyframes feed-scroll{to{transform:translateX(-50%)}}
@media(max-width:767px){.hero{height:430px;margin-top:12px;border-radius:15px}.hero-pokemon-art{height:72%}.hero-caption{bottom:58px}.live-feed{margin-top:12px;border-radius:13px}.feed-track{animation-duration:27s}.feed-item{padding:12px 20px}}
.all-boxes-link{display:inline-flex;align-items:center;gap:9px;min-height:42px;padding:9px 17px;border:1px solid #aa9000;border-radius:999px;background:#fff;color:#5f5000;font-size:13px;font-weight:800;box-shadow:0 5px 16px rgba(112,93,0,.08);transition:background .2s,transform .2s,box-shadow .2s}.all-boxes-link span{font-size:18px;line-height:1}.all-boxes-link:hover,.all-boxes-link:focus-visible{background:var(--gold);transform:translateY(-1px);box-shadow:0 8px 20px rgba(112,93,0,.15);outline:none}
@media(max-width:600px){.section-head{align-items:center;gap:12px}.all-boxes-link{min-height:38px;padding:7px 13px;font-size:12px;white-space:nowrap}}
.faq-list p{overflow:hidden;transform-origin:top;animation:faq-answer-in .32s cubic-bezier(.22,.8,.3,1)}
@keyframes faq-answer-in{from{max-height:0;margin-top:0;opacity:0;transform:translateY(-7px)}to{max-height:120px;opacity:1;transform:translateY(0)}}
</style>
