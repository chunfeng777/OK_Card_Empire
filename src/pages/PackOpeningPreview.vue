<script setup lang="ts">
import { useRouter } from 'vue-router'
import PackOpening from '../components/pack-opening/PackOpening.vue'
const router = useRouter()
</script>
<template><PackOpening preview title="OK PACK · 独立预览" @close="router.push('/')"/></template>
