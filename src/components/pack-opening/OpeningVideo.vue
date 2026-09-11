<script setup lang="ts">
import { onMounted, ref } from 'vue'
defineProps<{ src: string }>()
const emit = defineEmits<{ complete: [] }>()
const video = ref<HTMLVideoElement>(), blocked = ref(false), failed = ref(false)
async function play() { try { await video.value?.play(); blocked.value=false } catch { blocked.value=true } }
onMounted(play)
</script>
<template><div class="opening-video"><video ref="video" :src="src" poster="/images/pack-opening/ok-pack-reveal-poster.jpg" playsinline preload="auto" autoplay muted @canplay="play" @ended="emit('complete')" @error="failed=true"/><button v-if="blocked && !failed" @click="play">播放开包视频</button><p v-if="failed">视频暂时无法播放，请稍后重试。</p><button class="skip-video" @click="emit('complete')">{{failed?'查看结果':'跳过动画'}}</button></div></template>
<style scoped>.opening-video{position:relative;flex:1;min-height:0;width:100%;overflow:hidden;background:#000;display:flex;align-items:stretch;justify-content:center}.opening-video video{display:block;height:100%;width:auto;max-width:100%;object-fit:contain;background:#000}.opening-video button{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:12px 24px;background:#e2c58d;border:0;border-radius:4px;cursor:pointer}.opening-video .skip-video{left:auto;right:18px;top:16px;transform:none;background:#141412b0;color:#fff;border:1px solid #ffffff50;padding:8px 14px}.opening-video p{position:absolute;align-self:center;color:#ead9b4;background:#000b;padding:16px}</style>
