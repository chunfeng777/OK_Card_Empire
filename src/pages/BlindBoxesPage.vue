<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { boxes, type BlindBox } from '../data'
import BlindBoxCard from '../components/BlindBoxCard.vue'
import DrawModal from '../components/DrawModal.vue'

const { t } = useI18n()
const search = ref('')
const selected = ref<string[]>([])
const sort = ref('recommended')
const chosen = ref<BlindBox|null>(null)
const count = ref(1)
const ips = [
  { key:'pikachu', tag:'皮卡丘' }, { key:'eevee', tag:'伊布' },
  { key:'charizard', tag:'喷火龙' }, { key:'mewtwo', tag:'超梦' },
  { key:'squirtle', tag:'杰尼龟' }, { key:'rayquaza', tag:'烈空坐' },
]
const sortOptions = ['recommended','popular','newest','low','high','stock']
const filtered = computed(() => {
  const keyword = search.value.trim().toLocaleLowerCase()
  let result = boxes.filter(box => {
    const localized = `${t(`boxes.${box.id}.name`)} ${t(`boxes.${box.id}.subtitle`)}`.toLocaleLowerCase()
    return (!keyword || localized.includes(keyword) || `${box.name}${box.tags}`.toLocaleLowerCase().includes(keyword))
      && (!selected.value.length || selected.value.some(item => box.tags.includes(item)))
  })
  if (sort.value === 'low') result = [...result].sort((a,b) => a.price-b.price)
  if (sort.value === 'high') result = [...result].sort((a,b) => b.price-a.price)
  if (sort.value === 'stock') result = [...result].sort((a,b) => b.remaining-a.remaining)
  return result
})
function toggle(tag:string){selected.value=selected.value.includes(tag)?selected.value.filter(item=>item!==tag):[...selected.value,tag]}
function clear(){selected.value=[];search.value=''}
function draw(box:BlindBox,total:number){chosen.value=box;count.value=total}
function ipName(tag:string){const ip=ips.find(item=>item.tag===tag);return ip?t(`blindBoxes.ip.${ip.key}`):tag}
</script>

<template>
  <main>
    <section class="list-hero"><div class="container"><span class="pill gold">{{t('blindBoxes.licensed')}}</span><h1>{{t('blindBoxes.title')}}</h1><p>{{t('blindBoxes.subtitle')}}</p></div></section>
    <section class="container list-page">
      <aside class="filters card">
        <div class="field"><label>{{t('blindBoxes.search')}}</label><input v-model="search" :placeholder="t('blindBoxes.searchPlaceholder')"></div>
        <div><h3>{{t('blindBoxes.activity')}}</h3><div class="filter-tags"><button class="active">{{t('blindBoxes.all')}}</button><button>{{t('blindBoxes.newcomer')}}</button><button>{{t('blindBoxes.hot')}}</button></div></div>
        <div><h3>{{t('blindBoxes.pokemonIp')}}</h3><div class="ip-list"><button v-for="ip in ips" :key="ip.key" :class="{selected:selected.includes(ip.tag)}" @click="toggle(ip.tag)"><span>{{t(`blindBoxes.ip.${ip.key}`).slice(0,1)}}</span>{{t(`blindBoxes.ip.${ip.key}`)}}</button></div></div>
        <button class="clear" @click="clear">{{t('blindBoxes.clear')}}</button>
      </aside>
      <div class="results">
        <div class="results-head"><div>{{t('blindBoxes.count',{count:filtered.length})}} <span v-for="item in selected" :key="item" class="pill gold">{{ipName(item)}} ×</span></div><select v-model="sort"><option v-for="item in sortOptions" :key="item" :value="item">{{t(`blindBoxes.sort.${item}`)}}</option></select></div>
        <div v-if="filtered.length" class="product-grid"><BlindBoxCard v-for="box in filtered" :key="box.id" :box="box" @draw="draw"/></div>
        <div v-else class="empty card"><h2>{{t('blindBoxes.empty')}}</h2><p class="muted">{{t('blindBoxes.emptyHint')}}</p><button class="btn btn-primary" @click="clear">{{t('blindBoxes.clearShort')}}</button></div>
        <button v-if="filtered.length" class="btn load">{{t('blindBoxes.load')}}</button>
      </div>
    </section>
    <DrawModal :box="chosen" :count="count" @close="chosen=null"/>
  </main>
</template>

<style scoped>
.list-hero{height:330px;color:white;background:linear-gradient(90deg,rgba(20,18,6,.82),rgba(112,93,0,.25)),url('/images/pokemon/rayquaza.png') right 5% center/auto 125% no-repeat,linear-gradient(135deg,#102d42,#176b68 58%,#b8e857);display:flex;align-items:center}.list-hero h1{font-size:48px;margin:14px 0 7px}.list-hero p{color:#eee}.list-page{display:grid;grid-template-columns:230px 1fr;gap:28px;padding:50px 0 80px}.filters{padding:20px;position:sticky;top:92px;align-self:start}.filters h3{font-size:13px;margin-top:28px;border-bottom:1px solid var(--line);padding-bottom:9px}.filter-tags{display:flex;flex-wrap:wrap;gap:7px}.filter-tags button,.clear{border:1px solid var(--line);background:white;border-radius:20px;padding:6px 10px;font-size:11px}.filter-tags .active{background:var(--gold);border-color:var(--gold)}.ip-list{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ip-list button{border:1px solid var(--line);background:#fff;border-radius:9px;padding:8px 3px;font-size:11px}.ip-list span{width:28px;height:28px;margin:0 auto 5px;border-radius:50%;background:#f3f2e9;display:grid;place-items:center}.ip-list button.selected{border-color:var(--gold);background:#fffbea}.clear{width:100%;margin-top:24px}.results-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;font-size:13px}.results-head select{border:1px solid var(--line);border-radius:9px;padding:9px;background:white}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.load{display:flex;margin:38px auto 0;background:white;border:1px solid var(--brown);color:var(--brown);border-radius:30px}
@media(max-width:1023px){.product-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:767px){.list-hero{height:260px}.list-hero h1{font-size:36px}.list-page{grid-template-columns:1fr;padding-top:20px}.filters{position:static}.ip-list{grid-template-columns:repeat(3,1fr)}.product-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.product-grid{grid-template-columns:1fr}.results-head{align-items:flex-start;gap:10px}}
</style>
