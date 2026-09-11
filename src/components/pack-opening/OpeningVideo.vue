<script setup lang="ts">
import { onMounted, ref } from 'vue'
defineProps<{ src: string }>()
const emit = defineEmits<{ complete: [] }>()
const video = ref<HTMLVideoElement>(), blocked = ref(false), failed = ref(false)
async function play() { try { await video.value?.play(); blocked.value=false } catch { blocked.value=true } }
onMounted(play)
</script>
<template><div class="opening-video"><video ref="video" :src="src" playsinline preload="auto" controls @ended="emit('complete')" @error="failed=true"/><button v-if="blocked && !failed" @click="play">播放开包视频</button><p v-if="failed">视频暂时无法播放，请稍后重试。</p><button class="skip-video" @click="emit('complete')">{{failed?'查看结果':'跳过视频'}}</button></div></template>
<style scoped>.opening-video{position:fixed;inset:0;z-index:10;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column}.opening-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.opening-video button{position:absolute;bottom:90px;padding:12px 24px;background:#e2c58d;border:0;border-radius:4px;cursor:pointer}.opening-video .skip-video{top:max(20px,env(safe-area-inset-top));right:24px;bottom:auto;background:#141412b0;color:#fff;border:1px solid #ffffff50}.opening-video p{position:absolute;color:#ead9b4;background:#000b;padding:16px}</style>
