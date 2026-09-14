<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlindBox } from '../data'

const props = defineProps<{box: BlindBox}>()
defineEmits<{draw:[box:BlindBox,count:number]}>()
const { t, tm } = useI18n()
const display = computed(() => ({
  name: t(`boxes.${props.box.id}.name`),
  subtitle: t(`boxes.${props.box.id}.subtitle`),
  badge: t(`boxes.${props.box.id}.badge`),
  tags: tm(`boxes.${props.box.id}.tags`) as string[],
}))
</script>

<template>
  <article class="box-card card">
    <RouterLink :to="`/blind-boxes/${box.id}`" class="box-image"><span :class="['badge',box.remaining===0?'sold':'']">{{display.badge}}</span><img :src="box.image" :alt="display.name" loading="lazy"></RouterLink>
    <div class="box-body">
      <div class="tags"><span v-for="tag in display.tags.slice(0,3)" :key="tag" class="pill">{{tag}}</span></div>
      <RouterLink :to="`/blind-boxes/${box.id}`"><h3>{{display.name}}</h3><p>{{display.subtitle}}</p></RouterLink>
      <div class="price"><small>{{t('boxCard.drawPrice')}}</small><strong>{{box.price.toLocaleString()}} <em>OK Coin</em></strong></div>
      <div class="stock"><div><span>{{t('boxCard.stock')}}</span><b>{{box.remaining}} / {{box.total}}</b></div><div class="progress"><i :style="{width:`${box.remaining/box.total*100}%`}"></i></div></div>
      <div class="actions"><button class="btn btn-outline" :disabled="!box.remaining" @click="$emit('draw',box,1)">{{t('boxCard.single')}}</button><button class="btn btn-primary" :disabled="box.remaining<10" @click="$emit('draw',box,10)">{{t('boxCard.ten')}}</button></div>
      <small v-if="box.remaining>0&&box.remaining<10" class="disabled-reason">{{t('boxCard.insufficient')}}</small>
    </div>
  </article>
</template>

<style scoped>
.box-card{overflow:hidden;display:flex;flex-direction:column;transition:.25s}.box-card:hover{transform:translateY(-5px);box-shadow:var(--shadow)}.box-image{aspect-ratio:4/3;background:radial-gradient(circle at 50% 42%,#fff 0 18%,transparent 55%),linear-gradient(145deg,#fff5ac,#ffd64e);position:relative;display:grid;place-items:center;overflow:hidden}.box-image img{width:100%;height:100%;padding:24px;object-fit:contain;filter:drop-shadow(0 12px 13px rgba(72,54,0,.18));transition:.35s}.box-card:hover img{transform:scale(1.04)}.badge{position:absolute;top:12px;left:12px;z-index:2;background:var(--brown);color:#fff;font-size:11px;font-weight:800;padding:5px 9px;border-radius:5px}.badge.sold{background:#666}.box-body{padding:18px;display:flex;flex-direction:column;flex:1}.tags{display:flex;gap:6px;margin-bottom:9px}.box-body h3{font-size:16px;margin:0 0 6px}.box-body p{font-size:12px;color:var(--muted);margin:0}.price{margin:18px 0 13px}.price small{display:block;color:var(--muted)}.price strong{font-size:20px;color:var(--brown)}.price em{font-style:normal;font-size:11px}.stock>div:first-child{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px}.actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.actions .btn{padding:8px;min-height:38px;font-size:12px}.disabled-reason{font-size:10px;color:var(--danger);margin-top:7px}
</style>
